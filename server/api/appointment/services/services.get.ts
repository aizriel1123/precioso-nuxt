
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    return await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        price: true
      }
    });
  });