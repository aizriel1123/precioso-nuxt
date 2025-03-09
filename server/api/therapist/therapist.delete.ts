import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Read the request body to get the therapist ID
  const { id } = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Therapist id is required",
    });
  }
  
  const therapistId = parseInt(id, 10);

  try {
    // Ensure the therapist exists
    const therapist = await prisma.therapist.findUnique({
      where: { id: therapistId },
    });
    if (!therapist) {
      throw createError({
        statusCode: 404,
        message: "Therapist not found",
      });
    }

    // Use a transaction to delete dependent records then the therapist
    const deletedTherapist = await prisma.$transaction(async (tx) => {
      // 1. Delete related Account records
      await tx.account.deleteMany({
        where: { therapist_id: therapistId },
      });

      // 2. Get Transaction IDs for transactions referencing this therapist
      const transactionsToDelete = await tx.transaction.findMany({
        where: { therapist_id: therapistId },
        select: { id: true },
      });
      const transactionIds = transactionsToDelete.map((t) => t.id);

      if (transactionIds.length > 0) {
        // 3. Delete dependent records for these transactions
        await tx.productsSold.deleteMany({
          where: { transaction_id: { in: transactionIds } },
        });
        await tx.promoTransaction.deleteMany({
          where: { transaction_id: { in: transactionIds } },
        });
        await tx.serviceTransaction.deleteMany({
          where: { transaction_id: { in: transactionIds } },
        });
        await tx.appointment.deleteMany({
          where: { transaction_id: { in: transactionIds } },
        });

        // 4. Delete the transactions themselves
        await tx.transaction.deleteMany({
          where: { id: { in: transactionIds } },
        });
      }

      // 5. Delete other dependent records (e.g., Defect and Stockin)
      await tx.defect.deleteMany({
        where: { therapist_id: therapistId },
      });
      await tx.stockin.deleteMany({
        where: { therapist_id: therapistId },
      });

      // 6. Finally, delete the therapist record
      return await tx.therapist.delete({
        where: { id: therapistId },
      });
    });

    return {
      status: 200,
      message: "Therapist deleted successfully",
      data: deletedTherapist,
    };
  } catch (error) {
    console.error("Error deleting therapist:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete therapist",
    });
  }
});
