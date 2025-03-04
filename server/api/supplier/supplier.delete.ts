import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Read the request body
  const body = await readBody(event);
  // Expect the ID in the body (for example, as "delete_id")
  if (!body.delete_id) {
    throw createError({ statusCode: 400, statusMessage: 'Supplier ID is required' });
  }

  try {
    const deletedSupplier = await prisma.supplier.delete({
      where: { id: Number(body.delete_id) },
    });
    return {
      success: true,
      message: 'Supplier deleted successfully',
      data: deletedSupplier,
    };
  } catch (error) {
    console.error('Delete Supplier Error:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Failed to delete supplier',
    }));
  }
});
