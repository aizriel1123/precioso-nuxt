import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  // Only if present
  const status = await prisma.promoStatus.findFirst({
    where: {
      status: "Available",
    },
    select: {
      id: true,
    }
  })
  if (!status) throw new Error("Invalid Status")

  const promos = await prisma.promo.findMany({
    where: {
      status_id: status.id,
    },
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