import prisma from '~/lib/prisma';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, price, commission, type } = body;

    // Validate required fields
    if (!name || price === undefined || commission === undefined || !type) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: name, price, commission, and type are required.',
      });
    }

    // Convert price and commission to float
    const priceValue = parseFloat(price);
    const commissionRateValue = parseFloat(commission);

    if (isNaN(priceValue) || isNaN(commissionRateValue)) {
      throw createError({
        statusCode: 400,
        message: 'Price and commission must be valid numbers.',
      });
    }

    // Find or create the commission rate
    let commissionRate = await prisma.commissionRate.findFirst({
      where: { 
        rate: { 
          equals: commissionRateValue 
        } 
      },
    });

    if (!commissionRate) {
      commissionRate = await prisma.commissionRate.create({
        data: { 
          rate: commissionRateValue 
        },
      });
    }

    // Find or create the service type
    let serviceType = await prisma.serviceType.findFirst({
      where: { 
        type: { 
          equals: type 
        } 
      },
    });

    if (!serviceType) {
      serviceType = await prisma.serviceType.create({
        data: { 
          type 
        },
      });
    }

    // Create the service
    const newService = await prisma.service.create({
      data: {
        name,
        price: priceValue,
        commission_rate_id: commissionRate.id,
        service_type_id: serviceType.id,
      },
      include: {
        CommissionRate: true,
        ServiceType: true,
      },
    });

    return {
      id: newService.id,
      name: newService.name,
      price: newService.price,
      commission: newService.CommissionRate.rate,
      type: newService.ServiceType.type,
    };
  } catch (error) {
    console.error('Error creating service:', error);
    
    // Check if it's a Prisma-specific error
    
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error: Unable to create service.',
    });
  }
});