import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
      const clients = await prisma.client.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      })
      return { success: true, clients }
    } catch (error) {
    return { error: 'Failed to fetch clients' };
  }
})
