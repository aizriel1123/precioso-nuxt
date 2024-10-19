import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Get data from the request body
  const body = await readBody(event);

  // Implement validation for body data (optional but recommended)

  // Update product
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: body.update_id, // The unique identifier for the product
      },
      data: {
        name: body.update_product_name, // New name for the product
        cost: body.update_product_cost, // New cost for the product
        commission: body.update_product_commission_rate, // New commission rate
        critical_level: body.update_product_warning_level, // New critical level
        ProductType: {
          connect: {
            type: body.update_product_type, // Connect the updated product type
          },
        },
        StockinProduct: {
            update: {
              where: {
                id_product_id: {
                  id: body.stock_id, // You need to pass the correct `id` of the StockinProduct
                  product_id: body.product_id, // Use the `product_id` as part of the compound key
                },
              },
              data: {
                quantity: body.update_product_stock, // Update stock quantity
              },
            },
          }
      },
    });

    return {
      message: "Product updated successfully",
      updatedProduct,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      error: "Failed to update product",
    };
  }
});
