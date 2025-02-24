// server/api/suppliers.js

import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
        // Fetch supplier names from the Supplier table
        const supplier_names = await prisma.supplier.findMany({
          select: { supplier_name: true, id: true }, // Only select the supplier_name column
        });
        
        // Return the data as a JSON response
        return supplier_names;
      } catch (error) {
        // Handle any errors that occur during the database query
        return { error: 'Failed to fetch suppliers' };
      }
    
});
