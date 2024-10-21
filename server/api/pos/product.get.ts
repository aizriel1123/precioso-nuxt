import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.product.findMany();
    const services = await prisma.service.findMany()
    const promos = await prisma.promo.findMany()

    return {
        services: services,
        products: products,
        promos: promos,
      };
  } catch (error) {
    // Handle any errors during the database query
    console.error('Failed to fetch products:', error);
    return { error: 'Failed to fetch products' };
  }
});
