import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const promos = await prisma.promo.findMany({
      include: {
        CommissionRate: true,
      },
    });
    return promos;
  } catch (error) {
    console.error('Error fetching promos:', error);
    throw createError({ statusCode: 500, message: 'Failed to fetch promos' });
  }
});
