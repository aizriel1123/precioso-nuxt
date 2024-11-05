import prisma from "~/lib/prisma";

// pages/api/therapist/update.js
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      therapistId,
      first_name, 
      last_name, 
      dob, 
      gender_id,
      status_id,
      contactinfo,
      schedule,
    } = body

    // Validate required data
    if (!therapistId || !first_name || !last_name || !gender_id || !status_id) {
      return createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Update therapist in database using Prisma
    const updatedTherapist = await prisma.therapist.update({
      where: {
        id: parseInt(therapistId)
      },
      data: {
        first_name,
        last_name,
        dob: dob ? new Date(dob) : null,
        gender_id: parseInt(gender_id),
        status_id: parseInt(status_id),
        schedule,
        contactinfo
      },
      include: {
        Gender: true,
        TherapistStatus: true
      }
    })

    return updatedTherapist
  } catch (error) {
    console.error('Error updating therapist:', error)
    return createError({
      statusCode: 500,
      message: 'Failed to update therapist'
    })
  }
})
