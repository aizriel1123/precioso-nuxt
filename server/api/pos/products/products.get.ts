import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sell: true,
    }
  });
  
  return products.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.sell)  // convert Decimal/string to number
  }));
});
