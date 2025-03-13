import prisma from '~/lib/prisma';
import { defineEventHandler, readBody } from 'h3';

interface TransactionPayload {
  clientId: number;
  therapistId: number;
  paymentMode: 'cash' | 'gcash';
  notes?: string;
  products?: { id: number; quantity: number; price?: number }[];
  promos?: { id: number; statusId?: number }[];
  services?: { id: number; quantity: number; price?: number }[];
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<TransactionPayload>(event);
    console.log("Received payload:", JSON.stringify(body, null, 2));

    if (!body.clientId) throw new Error('Client ID is required');
    if (!body.therapistId) throw new Error('Therapist ID is required');
    if (!body.paymentMode) throw new Error('Payment mode is required');

    const modeId = body.paymentMode === 'cash' ? 1 : 2;

    const result = await prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: {
          client_id: body.clientId,
          therapist_id: body.therapistId,
          mode_of_payment_id: modeId,
          notes: body.notes,
          date: new Date().toISOString(),
        },
      });

      console.log("Created Transaction:", JSON.stringify(transaction, null, 2));

      if (body.products && body.products.length > 0) {
        for (const prod of body.products) {
          const stockRecords = await prisma.stockinProduct.findMany({
            where: { product_id: prod.id },
          });
          const availableStock = stockRecords.reduce((acc, rec) => acc + (rec.quantity || 0), 0);
          console.log(`Product ID ${prod.id}: availableStock = ${availableStock}, requested = ${prod.quantity}`);

          if (availableStock < prod.quantity) {
            throw new Error(`Product with ID ${prod.id} is out of stock.`);
          }

          let remainingQty = prod.quantity;
          const stockinRecords = await prisma.stockin.findMany({
            where: { product_id: prod.id, quantity: { gt: 0 } },
            orderBy: { date: 'asc' },
          });
          for (const stockin of stockinRecords) {
            if (remainingQty <= 0) break;
            if (stockin.quantity > 0) {
              const deduct = Math.min(stockin.quantity, remainingQty);
              remainingQty -= deduct;
              await prisma.stockin.update({
                where: { id: stockin.id },
                data: { quantity: stockin.quantity - deduct },
              });
            }
          }
        }

        const soldProducts = await prisma.productsSold.createMany({
          data: body.products.map((prod) => ({
            transaction_id: transaction.id,
            product_id: prod.id,
            quantity: prod.quantity,
          })),
        });

        console.log("Products Sold:", JSON.stringify(soldProducts, null, 2));
      }

      if (body.promos && body.promos.length > 0) {
        console.log("Processing promos:", JSON.stringify(body.promos, null, 2));

        const promoIds = body.promos.map(p => p.id);
        const promosFromDB = await prisma.promo.findMany({ where: { id: { in: promoIds } } });

        console.log("Found promos:", JSON.stringify(promosFromDB, null, 2));

        const defaultPromoStatus = await prisma.promoStatus.findFirst();
        if (!defaultPromoStatus) {
          throw new Error("No default promo status found. Please seed your PromoStatus table.");
        }

        const promoTransactions = [];

        for (const promo of promosFromDB) {
          const payloadPromo = body.promos.find(p => p.id === promo.id);
          const promoStatusId = payloadPromo?.statusId || defaultPromoStatus.id;

          const promoTransaction = await prisma.promoTransaction.create({
            data: {
              transaction_id: transaction.id,
              promo_id: promo.id,
              status_id: promoStatusId,
              promo_name: promo.promo,
              promo_price: promo.price,
            },
          });

          promoTransactions.push(promoTransaction);
        }

        console.log("Promo Transactions Created:", JSON.stringify(promoTransactions, null, 2));
      }

      if (body.services && body.services.length > 0) {
        const serviceTransactions = [];

        for (const svc of body.services) {
          const serviceRecord = await prisma.service.findUnique({ where: { id: svc.id } });
          if (!serviceRecord) {
            console.warn(`Service ${svc.id} not found; skipping.`);
            continue;
          }

          const serviceTransaction = await prisma.serviceTransaction.create({
            data: {
              transaction_id: transaction.id,
              service_id: svc.id,
              quantity: svc.quantity,
              service_name: serviceRecord.name,
              service_price: serviceRecord.price,
            },
          });

          serviceTransactions.push(serviceTransaction);
        }

        console.log("Service Transactions Created:", JSON.stringify(serviceTransactions, null, 2));
      }

      return { success: true, transactionId: transaction.id };
    });

    console.log("Transaction successfully created:", JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error("Transaction error:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
});