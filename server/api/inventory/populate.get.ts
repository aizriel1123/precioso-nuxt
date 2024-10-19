// import prisma from "~/lib/prisma";
// import { dynamicDenest } from "~/lib/utils";

// export default defineEventHandler(async (event) => {
//   try {
//     // Fetch id, name, cost, and commission from the "product" table
//     //   { id: 1, name: 'Product A', type: 'Products', cost: 10.0, stock: 50, status: 'Available', commissionRate: 10 },
//     const products = await prisma.product.findMany({
//       select: {
//         name: true,
//         cost: true,
//         commission: true,
//         ProductType: {
//           select: {
//             type: true,
//           }
//         } ,
        
//         StockinProduct: {
//           select: {
//             quantity: true,
//           }
//         },
//         // Cant find status
//       }, 
//     });

//     const output = dynamicDenest(products, ["ProductType", "StockinProduct"])
//     console.dir(output, {depth: 5})
//     // console.log(products[0].cost.toNumber())
//     console.log(products)
//     // console.log(output)

//     // Return the data as a JSON response
//     return output;
//   } catch (error) {
//     // Handle any errors that occur during the database query
//     console.error('Failed to fetch products:', error); // Updated error message
//     return { error: 'Failed to fetch products' };  // Updated error message
//   }
// });
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch data for Product including name, cost, commission, product type, and stock quantity
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        cost: true,
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
      },
    });

    // Process the result to flatten the fields as desired
    const output = products.map(product => ({
      ...product,
      ProductType: product.ProductType.type, // Flatten ProductType to just its type
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
