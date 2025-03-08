import prisma from '~/lib/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

interface TransactionPayload {
  clientId: number;
  therapistId: number;
  paymentMode: 'cash' | 'gcash';
  notes?: string;
  // Products sold
  products?: { id: number; quantity: number }[];
  // Promos applied (only promo details)
  promos?: { id: number; statusId?: number }[];
  // Direct service sales (standalone services)
  services?: { id: number; quantity: number }[];
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

      // Process products: create ProductsSold records.
      if (body.products && body.products.length > 0) {
        await prisma.productsSold.createMany({
          data: body.products.map((prod) => ({
            transaction_id: transaction.id,
            product_id: prod.id,
            quantity: prod.quantity,
          })),
        });
      }

      // Process promos: create PromoTransaction records.
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
              promo_name: promo.promo,   // Use the promo name from the Promo table.
              promo_price: promo.price,
            },
          });
        }
      } else {
        console.log("No promos provided; skipping PromoTransaction creation.");
      }

      // Process direct service sales: create ServiceTransaction records.
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
