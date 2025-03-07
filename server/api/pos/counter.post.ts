import prisma from '~/lib/prisma';

interface TransactionPayload {
  clientId: number;
  therapistId: number;
  paymentMode: 'cash' | 'gcash';
  notes?: string;
  products?: { id: number, quantity: number }[];
  promos?: { id: number, statusId?: number }[];
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as TransactionPayload;
    const { clientId, therapistId, paymentMode, notes, products = [], promos = [] } = body;

    // Validate required fields
    if (!clientId) throw new Error('Client ID is required');
    if (!therapistId) throw new Error('Therapist ID is required');
    if (!paymentMode) throw new Error('Payment mode is required');

    const modeMapping: Record<string, number> = { cash: 1, gcash: 2 };
    const modeId = modeMapping[paymentMode] || 1;

    console.log('Creating transaction with data:', {
      clientId,
      therapistId,
      modeId,
      notes,
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

    // Process each product and update stock
    if (products.length > 0) {
      for (const product of products) {
        try {
          // Record the sold product
          await prisma.productsSold.create({
            data: {
              transaction_id: newTransaction.id,
              product_id: product.id,
              quantity: product.quantity
            }
          });
          console.log(`Added product ${product.id} to transaction`);

          // Find the most recent stockin record for the product
          const latestStockin = await prisma.stockin.findFirst({
            where: { product_id: product.id },
            orderBy: { date: 'desc' }
          });
          
          if (latestStockin) {
            // Subtract the sold quantity from stock
            await prisma.stockin.update({
              where: { id: latestStockin.id },
              data: {
                quantity: { decrement: product.quantity }
              }
            });
            console.log(`Updated stock for product ${product.id}`);
          } else {
            console.warn(`No stockin record found for product ${product.id}`);
          }
        } catch (productError) {
          console.error(`Error processing product ${product.id}:`, productError);
          // Continue processing other products even if one fails
        }
      }
    }

    // Process promos (if any)
    if (promos.length > 0) {
      for (const promo of promos) {
        try {
          await prisma.promoTransaction.create({
            data: {
              transaction_id: newTransaction.id,
              promo_id: promo.id,
              status_id: promo.statusId || 1 // Default to status 1 if not provided
            }
          });
          console.log(`Added promo ${promo.id} to transaction`);
        } catch (promoError) {
          console.error(`Error adding promo ${promo.id}:`, promoError);
          // Continue with other promos even if one fails
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
