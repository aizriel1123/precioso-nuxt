import prisma from "~/lib/prisma";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

  try {
    // Construct the data object (do not include a scalar "product_type" field)
    const data: any = {
      name: body.new_product_name,
      cost: new Prisma.Decimal(String(body.cost)),
      critical_level: body.critical_level,
      StockinProduct: {
        create: { quantity: body.stock }
      },
      ProductType: {
        connectOrCreate: {
          where: { type: String(body.product_type) }, // expects a string (e.g. "Serum")
          create: { type: String(body.product_type) }
        }
      }
    };

    // Include sell if provided
    if (body.selling_price !== null && body.selling_price !== undefined) {
      data.sell = new Prisma.Decimal(String(body.selling_price));
    }
    
    // Include commission if provided
    if (body.commission !== null && body.commission !== undefined) {
      data.commission = new Prisma.Decimal(String(body.commission));
    }

    // Create the Product
    const product = await prisma.product.create({ data });

    // If supplier_name is provided, find the supplier and create a Stockin entry
    if (body.supplier_name) {
      const supplier = await prisma.supplier.findFirst({
        where: { supplier_name: body.supplier_name }
      });
      
      if (!supplier) {
        throw new Error(`Supplier '${body.supplier_name}' not found.`);
      }
      
      await prisma.stockin.create({
        data: {
          supplier_id: supplier.id,
          product_id: product.id,
          quantity: body.stock,
          date: new Date()
        }
      });
    }

    return { message: "Product added successfully!", product };
  } catch (error) {
    console.error("Failed to add product:", error);
    throw createError({ statusCode: 500, message: "Failed to add product." });
  }
});
