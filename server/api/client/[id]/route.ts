// File: server/api/clients/[id].ts
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = event.context.params?.id

  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const client = await prisma.client.update({
        where: {
          id: parseInt(id as string)
        },
        data: {
          first_name: body.firstName,
          last_name: body.lastName,
          dob: new Date(body.dateOfBirth),
          gender_id: parseInt(body.gender_id),
          contact_info: body.contact_info
        }
      })
      return client
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update client'
      })
    }
  }
})