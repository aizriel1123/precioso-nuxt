import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    }
  });
  
  return services.map(service => ({
    id: service.id,
    name: service.name,
    price: service.price ? Number(service.price) : 0
  }));
});
