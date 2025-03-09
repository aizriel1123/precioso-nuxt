
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    const therapists = await prisma.therapist.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true
      }
    });
    return therapists.map(t => `${t.first_name} ${t.last_name}`);
  });