import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Read the request body to get the ID
  const { id } = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Therapist id is required'
    });
  }

  try {
    // Optionally, check if the therapist exists first
    const therapist = await prisma.therapist.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!therapist) {
      throw createError({
        statusCode: 404,
        message: 'Therapist not found'
      });
    }

    const deletedTherapist = await prisma.therapist.delete({
      where: { id: parseInt(id, 10) },
    });
    return {
      status: 200,
      message: 'Therapist deleted successfully',
      data: deletedTherapist,
    };
  } catch (error) {
    console.error('Error deleting therapist:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to delete therapist',
    });
  }
});
