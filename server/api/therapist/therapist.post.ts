import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { first_name, last_name, dob, gender_id, contactinfo, schedule, status_id } = body;

  // Validate and convert date
  const dateOfBirth = new Date(dob);
  if (isNaN(dateOfBirth.getTime())) {
    throw createError({ statusCode: 400, message: 'Invalid date format' });
  }
  const isoDate = dateOfBirth.toISOString();

  // Validate Gender record
  const genderRecord = await prisma.gender.findUnique({
    where: { id: parseInt(gender_id) },
  });
  if (!genderRecord) {
    throw createError({ statusCode: 404, message: 'Gender not found' });
  }

  // Validate Status record
  const statusRecord = await prisma.therapistStatus.findUnique({
    where: { id: parseInt(status_id) },
  });
  if (!statusRecord) {
    throw createError({ statusCode: 404, message: 'Status not found' });
  }

  try {
    // Provide a default type_id (e.g., 1) since it's required in the model.
    const newTherapist = await prisma.therapist.create({
      data: {
        first_name,
        last_name,
        dob: isoDate,
        gender_id: parseInt(gender_id),
        schedule,
        contactinfo,
        status_id: parseInt(status_id),
        type_id: 1 // Default or provided value for TherapistType relation
      },
    });
    return {
      status: 201,
      message: 'Therapist created successfully',
      data: newTherapist,
    };
  } catch (error) {
    console.error('Error creating therapist:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create therapist. Please try again later.',
    });
  }
});
