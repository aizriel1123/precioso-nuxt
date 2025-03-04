import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);
  const { name, price, commission } = body;

  if (!id || !name || price == null || commission == null) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    });
  }

  try {
    const updatedPromo = await prisma.promo.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        price: parseFloat(price),
        commission: parseFloat(commission)
      }
    });
    return updatedPromo;
  } catch (error) {
    console.error('Error updating promo:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update promo'
    });
  }
});
