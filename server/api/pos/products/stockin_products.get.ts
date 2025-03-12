
import prisma from '~/lib/prisma';


export default defineEventHandler(async (event) => {
    // Fetch products and include the Stockin relation
    const products = await prisma.product.findMany({
      include: { Stockin: true },
    })
  
    // Compute the stock for each product
    const productsWithStock = products.map(product => ({
      ...product,
      stock: product.Stockin.reduce((total, entry) => total + entry.quantity, 0)
    }))
  
    return productsWithStock
  })