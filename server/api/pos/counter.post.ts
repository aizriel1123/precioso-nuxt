import prisma from '~/lib/prisma';
import { defineEventHandler, readBody } from 'h3';

interface TransactionPayload {
  clientId: number;
  therapistId: number;
  paymentMode: 'cash' | 'gcash';
  notes?: string;
  // Products sold – note that we also allow a price snapshot if needed
  products?: { id: number; quantity: number; price?: number }[];
  // Promos applied (only promo details)
  promos?: { id: number; statusId?: number }[];
  // Direct service sales (standalone services)
  services?: { id: number; quantity: number; price?: number }[];
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<TransactionPayload>(event);
    console.log("Received payload:", body);

    // Validate required fields.
    if (!body.clientId) throw new Error('Client ID is required');
    if (!body.therapistId) throw new Error('Therapist ID is required');
    if (!body.paymentMode) throw new Error('Payment mode is required');

    // Map payment mode (assume cash = 1, gcash = 2)
    const modeId = body.paymentMode === 'cash' ? 1 : 2;

    const result = await prisma.$transaction(async (prisma) => {
      // Create the main Transaction record.
      const transaction = await prisma.transaction.create({
        data: {
          client_id: body.clientId,
          therapist_id: body.therapistId,
          mode_of_payment_id: modeId,
          notes: body.notes,
          date: new Date(),
        },
      });

      // === Process products: Check stock and update it before recording the sale ===
      if (body.products && body.products.length > 0) {
        // Loop through each product to ensure sufficient stock
        for (const prod of body.products) {
          // Aggregate total stock for this product from all Stockin entries
          const totalStock = await prisma.stockin.aggregate({
            _sum: { quantity: true },
            where: { product_id: prod.id },
          });
          // Use nullish coalescing to default to 0 if no stock found
          const availableStock = totalStock._sum.quantity ?? 0;
          console.log(
            `Checking stock for product id ${prod.id}: availableStock = ${availableStock}, requested = ${prod.quantity}`
          );

          // If available stock is less than the quantity requested, throw an error
          if (availableStock < prod.quantity) {
            throw new Error(`Product with id ${prod.id} is out of stock.`);
          }

          // Deduct the quantity sold using a FIFO approach:
          let remainingQty = prod.quantity;
          // Get Stockin records for this product that still have stock (ordered oldest first)
          const stockinRecords = await prisma.stockin.findMany({
            where: { product_id: prod.id, quantity: { gt: 0 } },
            orderBy: { date: 'asc' },
          });
          for (const stockin of stockinRecords) {
            if (remainingQty <= 0) break;
            if (stockin.quantity > 0) {
              // Determine how many units to deduct from this record
              const deduct = Math.min(stockin.quantity, remainingQty);
              remainingQty -= deduct;
              await prisma.stockin.update({
                where: { id: stockin.id },
                data: { quantity: stockin.quantity - deduct },
              });
            }
          }
        }

        // After updating the stock, create ProductsSold records for all sold products.
        await prisma.productsSold.createMany({
          data: body.products.map((prod) => ({
            transaction_id: transaction.id,
            product_id: prod.id,
            quantity: prod.quantity,
          })),
        });
      }

      // === Process promos: Create PromoTransaction records ===
      if (body.promos && body.promos.length > 0) {
        console.log("Processing promos:", body.promos);
        // Retrieve promos for the provided promo IDs.
        const promoIds = body.promos.map(p => p.id);
        const promosFromDB = await prisma.promo.findMany({
          where: { id: { in: promoIds } },
        });
        console.log("Found promos:", promosFromDB);
        // Look up a default promo status (for example, the first record in PromoStatus).
        const defaultPromoStatus = await prisma.promoStatus.findFirst();
        if (!defaultPromoStatus) {
          throw new Error("No default promo status found. Please seed your PromoStatus table.");
        }
        for (const promo of promosFromDB) {
          const payloadPromo = body.promos.find(p => p.id === promo.id);
          // Use the provided statusId or the default promo status.
          const promoStatusId = payloadPromo?.statusId || defaultPromoStatus.id;
          console.log(`Creating PromoTransaction for promo ${promo.id} with status ${promoStatusId}`);
          await prisma.promoTransaction.create({
            data: {
              transaction_id: transaction.id,
              promo_id: promo.id,
              status_id: promoStatusId,
              promo_name: promo.promo,   // Using the promo name from the Promo table.
              promo_price: promo.price,
            },
          });
        }
      } else {
        console.log("No promos provided; skipping PromoTransaction creation.");
      }

      // === Process services: Create ServiceTransaction records ===
      if (body.services && body.services.length > 0) {
        for (const svc of body.services) {
          // Look up the service to get its name and price.
          const serviceRecord = await prisma.service.findUnique({
            where: { id: svc.id },
          });
          if (!serviceRecord) {
            console.warn(`Service ${svc.id} not found; skipping.`);
            continue;
          }
          await prisma.serviceTransaction.create({
            data: {
              transaction_id: transaction.id,
              service_id: svc.id,
              quantity: svc.quantity,
              service_name: serviceRecord.name,
              service_price: serviceRecord.price,
            },
          });
        }
      }

      return { success: true, transactionId: transaction.id };
    });

    console.log("Transaction created:", result.transactionId);
    return result;
  } catch (error: any) {
    console.error("Transaction error:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
});
