import prisma from '~/lib/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, price, commission } = body; // 'commission' represents commission_rate_id

    // Validate required fields
    if (!name || price === undefined || commission === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: name, price, and commission are required.',
      });
    }

    const priceValue = parseFloat(price);
    const commissionRateId = parseInt(commission);

    if (isNaN(priceValue) || isNaN(commissionRateId)) {
      throw createError({
        statusCode: 400,
        message: 'Price must be a valid number and commission must be a valid commission rate id.',
      });
    }

    // Verify that the commission rate exists
    const commissionRate = await prisma.commissionRate.findUnique({
      where: { id: commissionRateId },
    });
    if (!commissionRate) {
      throw createError({
        statusCode: 400,
        message: 'Invalid commission rate id',
      });
    }

    // Define a default service type name
    const defaultServiceTypeName = "Default Service";

    // Look for an existing default service type
    let serviceType = await prisma.serviceType.findFirst({
      where: { type: defaultServiceTypeName },
    });

    // If not found, create one
    if (!serviceType) {
      serviceType = await prisma.serviceType.create({
        data: { type: defaultServiceTypeName },
      });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        price: priceValue,
        commission_rate_id: commissionRate.id,
        service_type_id: serviceType.id,
      },
      include: {
        CommissionRate: true,
      },
    });

    return {
      id: newService.id,
      name: newService.name,
      price: newService.price,
      commission: newService.CommissionRate.rate,
    };
  } catch (error) {
    console.error('Error creating service:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error: Unable to create service.',
    });
  }
});
