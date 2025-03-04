//services.get.ts

import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const services = await prisma.service.findMany();
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch services'
    });
  }
});
