import prisma from "~/lib/prisma";

// pages/api/client/update.js
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      clientId,
      first_name, 
      last_name, 
      dob, 
      gender_id, 
      contact_info 
    } = body

    // Validate required data
    if (!clientId || !first_name || !last_name || !gender_id) {
      return createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Update client in database using Prisma
    const updatedClient = await prisma.client.update({
      where: {
        id: parseInt(clientId)
      },
      data: {
        first_name,
        last_name,
        dob: dob ? new Date(dob) : null,
        gender_id: parseInt(gender_id),
        contact_info
      },
      include: {
        Gender: true
      }
    })

    return updatedClient
  } catch (error) {
    console.error('Error updating client:', error)
    return createError({
      statusCode: 500,
      message: 'Failed to update client'
    })
  }
})
