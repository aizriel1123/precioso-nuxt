import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        CommissionRate: true, // include the related commission rate data
      },
    });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw createError({ statusCode: 500, message: 'Failed to fetch services' });
  }
});
