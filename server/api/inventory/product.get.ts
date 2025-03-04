// server/api/product.get.ts

import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch full product details from the Product table
    const products = await prisma.product.findMany({
      select: { 
        id: true,        // Product ID
        name: true,      // Product Name
        price: true,     // Example additional field
      }, 
    });

    return products;
  } catch (error) {
    return { error: "Failed to fetch products" };
  }
});
