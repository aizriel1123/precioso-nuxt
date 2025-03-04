import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const suppliers = await prisma.supplier.findMany({
    include: {
      Stockin: {
        include: {
          Product: true
        }
      }
    }
  });
  return suppliers;
});

