import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, name, price, commission, status, description } = body;

  if (!id || !name || price == null || commission == null || !status || !description) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    });
  }

  try {
    const updatedPromo = await prisma.promo.update({
      where: { id: parseInt(id, 10) },
      data: {
        promo: name,
        price: parseFloat(price),
        commission_rate_id: parseInt(commission),
        status_id: parseInt(status),
        description: description,
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
