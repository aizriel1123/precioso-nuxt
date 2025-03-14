import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  // Read all data from the request body including id
  console.log("You have edited-in");
  const body = await readBody(event);
  const { id, name, price, commission, type } = body;
  if (!id || !name || price == null || commission == null || !type) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    });
  }

  try {
    // Convert commission to a float value
    const commissionRateValue = parseFloat(commission);

    // Find or create the commission rate record
    let commissionRate = await prisma.commissionRate.findFirst({
      where: { id: commissionRateValue }
    });
    if (!commissionRate) {
      throw createError({
        statusCode: 400,
        message: 'Invalid Commission Rate'
      });
    }

    // Find or create the service type record
    let serviceType = await prisma.serviceType.findFirst({
      where: { type }
    });
    if (!serviceType) {
      serviceType = await prisma.serviceType.create({
        data: { type }
      });
    }

    // Update the service with the new values and proper foreign key references
    const updatedService = await prisma.service.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        price: parseFloat(price),
        commission_rate_id: commissionRate.id,
        service_type_id: serviceType.id
      }
    });

    return {
      status: 200,
      message: 'Service updated successfully',
      data: updatedService
    };
  } catch (error) {
    console.error('Error updating service:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update service'
    });
  }
});
