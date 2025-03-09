// server/api/promos.get.js
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    return await prisma.promo.findMany({
      select: {
        id: true,
        promo: true,
        price: true,
        PromoServices: {
          include: {
            Service: true
          }
        }
      }
    });
  });