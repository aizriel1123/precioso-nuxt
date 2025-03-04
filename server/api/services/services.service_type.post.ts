import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type } = body;

  if (!type) {
    throw createError({
      statusCode: 400,
      message: 'Service type is required'
    });
  }

  try {
    // Check if the service type already exists
    let serviceType = await prisma.serviceType.findFirst({
      where: { type }
    });
    if (serviceType) {
      return {
        status: 200,
        message: 'Service type already exists',
        data: serviceType
      };
    }

    // Create a new service type record
    serviceType = await prisma.serviceType.create({
      data: { type }
    });

    return {
      status: 201,
      message: 'Service type created successfully',
      data: serviceType
    };
  } catch (error) {
    console.error('Error creating service type:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create service type'
    });
  }
});
