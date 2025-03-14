// /server/api/inventory/commissionRates.get.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
  try {
    const commissionRates = await prisma.commissionRate.findMany({
      select: {
        id: true,
        rate: true,
      },
    });

    return {
      success: true,
      data: commissionRates,
    };
  } catch (error: any) {
    console.error("Error fetching commission rates:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch commission rates",
    });
  }
});