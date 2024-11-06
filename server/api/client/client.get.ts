import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
        // Fetch clients from Client Table
        const client = await prisma.client.findMany({
          include: {
            Gender: true,
          }
        });
        
        // Return the data as a JSON response
        
        return client;
      } catch (error) {
        // Handle any errors that occur during the database query
        return { error: 'Failed to fetch clients' };
      }
});