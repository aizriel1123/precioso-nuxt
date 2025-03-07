// server/api/transactions.get.ts
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  return await prisma.transaction.findMany({
    include: {
      Client: true,
      Therapist: true,
      ProductsSold: true,
      Appointment: true
    },
    orderBy: { date: 'desc' }
  });
});