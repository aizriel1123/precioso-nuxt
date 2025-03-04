//services.delete.ts

import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Service id is required'
    });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id, 10) }
    });
    if (!service) {
      throw createError({
        statusCode: 404,
        message: 'Service not found'
      });
    }

    const deletedService = await prisma.service.delete({
      where: { id: parseInt(id, 10) }
    });
    return {
      status: 200,
      message: 'Service deleted successfully',
      data: deletedService
    };
  } catch (error) {
    console.error('Error deleting service:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to delete service'
    });
  }
});
