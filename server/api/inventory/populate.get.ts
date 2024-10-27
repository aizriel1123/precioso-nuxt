import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch data for Product including name, cost, commission, product type, and stock quantity
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        cost: true,
        critical_level: true,
        StockinProduct: {
          select: {
            quantity: true, // Just select quantity
          }
        },
        commission: true,
        ProductType: {
          select: {
            type: true, // Just select the type
          }
        },
        Supplier: {
          select: {
            supplier_name: true, //This is so that the supplier name is true
          }
        }
      },
    });

    // Process the result to flatten the fields as desired
    const output = products.map(product => ({
      ...product,
      ProductType: product.ProductType.type, // Flatten ProductType to just its type
      supplierName: product.Supplier.supplier_name, // Flatten ProductType to just its type
      StockinProduct: product.StockinProduct.length > 0 
        ? product.StockinProduct[0].quantity // Extract the first quantity if available
        : null, // Handle case where there's no stock
    }));

    // Log the structured output for debugging
    // console.log("This is to separate the random gibberish beforehand.")
    // console.log(output)

    // Return the parsed and flattened output
    return output;

  } catch (error) {
    // Handle any errors during the database query
    console.error('Failed to fetch products:', error);
    return { error: 'Failed to fetch products' };
  }
});
