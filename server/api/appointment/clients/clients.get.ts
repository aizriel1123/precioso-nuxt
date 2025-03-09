// appointment/client/client.get.ts


import prisma from '~/lib/prisma'


export default defineEventHandler(async (event) => {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true
    }
  });
  return clients.map(c => `${c.first_name} ${c.last_name}`);
});