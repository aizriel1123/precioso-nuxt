// appointment/client/client.get.ts


import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        contact_info: true
      },
      orderBy: { first_name: 'asc' }
    })

    return clients.map(client => ({
      id: client.id,
      fullName: `${client.first_name} ${client.last_name}`,
      contact: client.contact_info
    }))
    
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve clients'
    })
  }
})