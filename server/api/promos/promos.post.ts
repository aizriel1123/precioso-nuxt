import prisma from '~/lib/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, price, commission, description, status } = body; // 'commission' here represents the commission_rate_id

    if (!name || price == null || commission == null || !status) {
      throw createError({ statusCode: 400, message: 'Missing required fields' });
    }

    const commissionRateId = parseInt(commission);
    const statusId = parseInt(status)

    // Verify that the commission rate exists
    const commissionRateExists = await prisma.commissionRate.findUnique({
      where: { id: commissionRateId }
    });
    if (!commissionRateExists) {
      throw createError({ statusCode: 400, message: 'Invalid commission rate id' });
    }

    // Verify that the commission rate exists
    const statusCheck = await prisma.promoStatus.findUnique({
      where: { id: statusId }
    });
    if (!statusCheck) {
      throw createError({ statusCode: 400, message: 'Invalid promo status' });
    }

    const newPromo = await prisma.promo.create({
      data: {
        promo: name,
        price: parseFloat(price),
        commission_rate_id: commissionRateId,
        status_id: statusId,
        description: description || "",
      }
    });

    return { status: 201, message: 'Promo created successfully', data: newPromo };
  } catch (error) {
    console.error('Error creating promo:', error);
    throw createError({ statusCode: 500, message: 'Failed to create promo' });
  }
});
