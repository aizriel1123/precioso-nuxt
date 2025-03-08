import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const promos = await prisma.promo.findMany({
    select: {
      id: true,
      promo: true,
      price: true,
    }
  });
  
  return promos.map(promo => ({
    id: promo.id,
    name: promo.promo,  // Using the 'promo' field for the promo name
    price: Number(promo.price)
  }));
});