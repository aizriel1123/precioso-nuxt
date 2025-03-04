import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    // Validate required fields
    if (!body.supplier_name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Supplier name is required',
      });
    }

    // Create supplier
    let supplier = await prisma.supplier.create({
      data: {
        supplier_name: body.supplier_name,
        supplier_contactnum: body.supplier_contactnum,
        supplier_address: body.supplier_address,
      },
    });

    // Handle product association
    if (body.product) {
      const product = await prisma.product.findFirst({
        where: { name: body.product },
      });

      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: `Product "${body.product}" not found`,
        });
      }

      // Create Stockin entry with required fields, now without a therapist
      await prisma.stockin.create({
        data: {
          supplier_id: supplier.id,
          product_id: product.id,
          quantity: 0, // Default quantity
          therapist_id: null, // No therapist needed
          date: new Date(),
        }
      });

      // Re-fetch supplier with Stockin and nested Product relation
      const updatedSupplier = await prisma.supplier.findUnique({
        where: { id: supplier.id },
        include: {
          Stockin: {
            include: { Product: true }
          }
        }
      });

      if (!updatedSupplier) {
        throw createError({
          statusCode: 500,
          statusMessage: "Supplier not found after update"
        });
      }

      supplier = updatedSupplier;
    }
    
    return { 
      success: true, 
      data: supplier 
    };

  } catch (error: any) {
    console.error('Supplier creation error:', error);
    return {
      success: false,
      error: error.message || "An error occurred"
    };
  }
});
