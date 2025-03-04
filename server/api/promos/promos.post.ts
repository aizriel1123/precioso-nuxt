import prisma from '~/lib/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, price, commission } = body;

    if (!name || price == null || commission == null) {
      throw createError({ statusCode: 400, message: 'Missing required fields' });
    }

    const newPromo = await prisma.promo.create({
      data: {
        promo: name, 
        price: parseFloat(price), 
        commission_rate_id: parseInt(commission)
      }
    });


    return { status: 201, message: 'Promo created successfully', data: newPromo };
  } catch (error) {
    console.error('Error creating promo:', error);
    throw createError({ statusCode: 500, message: 'Failed to create promo' });
  }
});