import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Promo id is required'
    });
  }

  try {
    const promo = await prisma.promo.findUnique({
      where: { id: parseInt(id, 10) }
    });
    if (!promo) {
      throw createError({
        statusCode: 404,
        message: 'Promo not found'
      });
    }

    const deletedPromo = await prisma.promo.delete({
      where: { id: parseInt(id, 10) }
    });
    return {
      status: 200,
      message: 'Promo deleted successfully',
      data: deletedPromo
    };
  } catch (error) {
    console.error('Error deleting promo:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to delete promo'
    });
  }
});
