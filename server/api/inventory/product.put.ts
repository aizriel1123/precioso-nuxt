import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Parse the request body
  const body = await readBody(event);
  console.log("Waow")
  console.log(body)
  try {
    // Check if all necessary fields are provided
    if (!body.update_id || !body.update_product_name || !body.update_product_type) {
      throw new Error('Missing required fields');
    }

    // Update the product using Prisma ORM
    const updatedProduct = await prisma.product.update({
      where: {
        id: body.update_id,
      },
      data: {
        // id: body.update_id,
        name: body.update_product_name,
        cost: body.update_product_cost,
        sell: body.update_selling_price,
        commission: body.update_product_commission_rate,
        critical_level: body.update_product_warning_level,
        ProductType: {
          connect: {
            type: body.update_product_type, // Assuming type is unique
          },
        },
        StockinProduct: {
          update: {
            where: {
              id_product_id: {
                product_id: body.update_id, // This part is correct
                id: body.update_id,          // Here, 'id' is missing or not correctly passed
              },
            },
            data: {
              quantity: body.update_product_stock,
            },
          },
        },
      },
    });

    console.log(updatedProduct)
    console.log("WORKING")

    // Return the updated product details
    return {
      statusCode: 200,
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  } catch (error) {
    // Handle errors and return error response
    console.log(error)
    return {
      statusCode: 400,
    };
  }
});