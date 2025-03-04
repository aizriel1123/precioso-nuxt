import prisma from '~/lib/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, price, commission } = body; // 'commission' here represents the commission_rate_id

    if (!name || price == null || commission == null) {
      throw createError({ statusCode: 400, message: 'Missing required fields' });
    }

    const commissionRateId = parseInt(commission);

    // Verify that the commission rate exists
    const commissionRateExists = await prisma.commissionRate.findUnique({
      where: { id: commissionRateId }
    });
    if (!commissionRateExists) {
      throw createError({ statusCode: 400, message: 'Invalid commission rate id' });
    }

    const newPromo = await prisma.promo.create({
      data: {
        promo: name,
        price: parseFloat(price),
        commission_rate_id: commissionRateId
      }
    });

    return { status: 201, message: 'Promo created successfully', data: newPromo };
  } catch (error) {
    console.error('Error creating promo:', error);
    throw createError({ statusCode: 500, message: 'Failed to create promo' });
  }
});
