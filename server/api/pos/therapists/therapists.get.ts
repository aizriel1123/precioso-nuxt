// server/api/pos/therapists/therapists.get.ts
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const therapists = await prisma.therapist.findMany({
    include: {
      Gender: true,
      TherapistStatus: true,
      TherapistType: true
    }
  });

  return therapists.map(t => ({
    id: t.id, // include the id for key/value use
    name: `${t.first_name} ${t.last_name}`,
    status: t.TherapistStatus.status,
    type: t.TherapistType.type,
    gender: t.Gender.gender
  }));
});
