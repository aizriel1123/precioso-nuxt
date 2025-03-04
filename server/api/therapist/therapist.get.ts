import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const therapists = await prisma.therapist.findMany({
      include: {
        Gender: true,
        TherapistStatus: true,
      },
    });
    return therapists;
  } catch (error) {
    console.error('Error fetching therapists:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch therapists',
    });
  }
});
