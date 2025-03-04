import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const promos = await prisma.promo.findMany();
    return promos;
  } catch (error) {
    console.error('Error fetching promos:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch promos'
    });
  }
});


