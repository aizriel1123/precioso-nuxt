import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event)
      const updatedClient = await prisma.client.update({
        where: { id: body.id },
        data: {
          first_name: body.first_name,
          last_name: body.last_name,
        },
      })
      return { success: true, client: updatedClient }
    } catch (error) {
        return { error: 'Failed to fetch clients' };
    }
  })