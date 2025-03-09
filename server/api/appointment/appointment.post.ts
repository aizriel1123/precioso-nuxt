import prisma from '~/lib/prisma'


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    // Get client and therapist IDs
    const [clientFirstName, clientLastName] = body.clientName.split(' ');
    const client = await prisma.client.findFirst({
      where: {
        first_name: clientFirstName,
        last_name: clientLastName
      }
    });
  
    const [therapistFirstName, therapistLastName] = body.therapistName.split(' ');
    const therapist = await prisma.therapist.findFirst({
      where: {
        first_name: therapistFirstName,
        last_name: therapistLastName
      }
    });
  
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(),
        client_id: client.id,
        therapist_id: therapist.id,
        mode_of_payment_id: 1, // Default payment mode
        notes: body.note
      }
    });
  
    // Create services transactions
    for (const service of body.services) {
      await prisma.serviceTransaction.create({
        data: {
          transaction_id: transaction.id,
          service_id: service.id,
          service_name: service.name,
          service_price: service.price
        }
      });
    }
  
    // Create promo transactions
    for (const promo of body.promos) {
      await prisma.promoTransaction.create({
        data: {
          transaction_id: transaction.id,
          promo_id: promo.id,
          promo_name: promo.promo,
          promo_price: promo.price,
          status_id: 1 // Default status
        }
      });
    }
  
    return { success: true };
  });
  