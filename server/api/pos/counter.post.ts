import prisma from '~/lib/prisma';

interface TransactionPayload {
  clientId: number;
  therapistId: number;
  paymentMode: 'cash' | 'gcash';
  notes?: string;
  services?: { id: number; quantity: number }[]; // <--- Add
  products?: { id: number; quantity: number }[];
  promos?: { id: number; quantity?: number; statusId?: number }[]; // allow quantity if you want
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as TransactionPayload;
    const {
      clientId,
      therapistId,
      paymentMode,
      notes,
      services = [],
      products = [],
      promos = [],
    } = body;

    // Validate required fields
    if (!clientId) throw new Error('Client ID is required');
    if (!therapistId) throw new Error('Therapist ID is required');
    if (!paymentMode) throw new Error('Payment mode is required');

    // Map string to mode_of_payment_id
    const modeMapping: Record<string, number> = { cash: 1, gcash: 2 };
    const modeId = modeMapping[paymentMode] || 1;

    console.log('Creating transaction with data:', {
      clientId,
      therapistId,
      modeId,
      notes,
      servicesCount: services.length,
      productsCount: products.length,
      promosCount: promos.length
    });

    // Create the transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        client_id: clientId,
        therapist_id: therapistId,
        mode_of_payment_id: modeId,
        notes: notes || "",
        date: new Date(),
      }
    });
    console.log('Transaction created:', newTransaction.id);

    // 1) Create Appointment records for each service
    if (services.length > 0) {
      for (const service of services) {
        try {
          await prisma.appointment.create({
            data: {
              transaction_id: newTransaction.id,
              service_id: service.id,
              quantity: service.quantity,
              appointment_status_id: 1, // or your default "Completed" status
            },
          });
          console.log(`Added service ${service.id} x${service.quantity} to transaction`);
        } catch (serviceError) {
          console.error(`Error adding service ${service.id}:`, serviceError);
        }
      }
    }

    // 2) Create ProductsSold for each product
    if (products.length > 0) {
      for (const product of products) {
        try {
          await prisma.productsSold.create({
            data: {
              transaction_id: newTransaction.id,
              product_id: product.id,
              quantity: product.quantity
            }
          });
          console.log(`Added product ${product.id} x${product.quantity} to transaction`);

          // Optionally update stock from your Stockin logic...
        } catch (productError) {
          console.error(`Error adding product ${product.id}:`, productError);
        }
      }
    }

    // 3) Create PromoTransaction for each promo
    if (promos.length > 0) {
      for (const promo of promos) {
        try {
          await prisma.promoTransaction.create({
            data: {
              transaction_id: newTransaction.id,
              promo_id: promo.id,
              status_id: promo.statusId || 1 // default to 1 if not provided
            }
          });
          console.log(`Added promo ${promo.id} to transaction`);
        } catch (promoError) {
          console.error(`Error adding promo ${promo.id}:`, promoError);
        }
      }
    }

    return {
      success: true,
      transactionId: newTransaction.id
    };

  } catch (error) {
    console.error('Error creating transaction:', error);
    return {
      success: false,
      error: 'Unknown error occurred'
    };
  }
});
