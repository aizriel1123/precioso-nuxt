// /server/api/inventory/product_type.get.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
  try {
    const productTypes = await prisma.productType.findMany({
      select: {
        id: true,
        type: true
      }
    });

    return { 
      success: true,
      data: productTypes 
    };
  } catch (error: any) {
    console.error('Error fetching product types:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product types',
    });
  }
});