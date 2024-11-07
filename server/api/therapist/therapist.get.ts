import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
        // Fetch therapists from Therapist Table
        const therapist = await prisma.therapist.findMany({
          include: {
            Gender: true,
            TherapistStatus: true,
          }
        });
        
        // Return the data as a JSON response
        
        return therapist;
      } catch (error) {
        // Handle any errors that occur during the database query
        return { error: 'Failed to fetch therapists' };
      }
});