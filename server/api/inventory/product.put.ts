import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Parse the request body
  const body = await readBody(event);
  console.log("Waow");
  console.log(body);

  try {
    // Validate required fields
    if (!body.update_id || !body.update_product_name || !body.update_product_type) {
      throw new Error("Missing required fields");
    }

    const productId = Number(body.update_id);

    // Check if any StockinProduct record exists for this product
    const existingStockinProduct = await prisma.stockinProduct.findFirst({
      where: { product_id: productId },
    });

    // Build nested update only if a StockinProduct record exists
    let stockinProductUpdate = {};
    if (existingStockinProduct) {
      stockinProductUpdate = {
        StockinProduct: {
          updateMany: {
            where: { product_id: productId },
            data: { quantity: Number(body.update_product_stock) },
          },
        },
      };
    }

    // Update the product using Prisma ORM
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: body.update_product_name,
        cost: Number(body.update_product_cost),
        sell: Number(body.update_selling_price),
        commission: Number(body.update_product_commission_rate),
        critical_level: Number(body.update_product_warning_level),
        ProductType: {
          connect: {
            type: body.update_product_type, // Assuming product type is unique
          },
        },
        ...stockinProductUpdate,
      },
    });

    console.log(updatedProduct);
    console.log("WORKING");

    return {
      statusCode: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      statusCode: 400,
      message: "Failed to update product",
    };
  }
});
