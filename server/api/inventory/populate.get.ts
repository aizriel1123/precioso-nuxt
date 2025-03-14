import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch data for each product
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        cost: true,
        sell: true,            // Include the selling price
        critical_level: true,
        ProductType: {
          select: { type: true }
        },
        // Get supplier info from Stockin
        CommissionRate: {
          select: {
            rate: true,
          },
        },
        Stockin: {
          select: {
            Supplier: {
              select: {
                supplier_name: true
              }
            }
          }
        },
        ProductsSold: {
          select: {
            quantity: true,
          },
        },
        // Get stock quantity from StockinProduct
        StockinProduct: {
          select: {
            quantity: true
          }
        }
      },
    });

    // Flatten the data into a shape your front end expects
    const output = products.map((product) => {
      const stock = product.StockinProduct.reduce((acc, rec) => acc + (rec.quantity || 0), 0);
      const sold = product.ProductsSold.reduce((acc, rec) => acc + (rec.quantity || 0), 0);

      return {
        id: product.id,
        name: product.name,
        // Convert Decimals to string (or parseFloat if you prefer numeric)
        cost: product.cost.toString(),
        commission: product.CommissionRate.rate.toString(),
        // We'll call it `sellingPrice` on the front end
        sellingPrice: product.sell.toString(),
        critical_level: product.critical_level ?? 0,
        // Flatten ProductType to just a string
        ProductType: product.ProductType?.type ?? "",
        // If you want to show just the first supplier
        supplierName: product.Stockin.length > 0
          ? product.Stockin[0].Supplier?.supplier_name ?? ""
          : "",
        // Show the first StockinProduct quantity (or sum them if you want total)
        StockinProduct: product.StockinProduct.length > 0
          ? stock - sold
          : 0,
      }
    });

    return output;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { error: "Failed to fetch products" };
  }
});
