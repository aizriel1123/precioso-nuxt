// server/api/suppplier/supplier.put.ts

import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Request Body:", body);

  try {
    // Validate required fields
    if (!body.update_id || !body.update_supplier_name || !body.update_contact_information || !body.update_supplier_address) {
      throw new Error('Missing required fields');
    }

    // Update the supplier using Prisma ORM
    const updatedSupplier = await prisma.supplier.update({
      where: {
        id: parseInt(body.update_id), // Ensure ID is an integer
      },
      data: {
        supplier_name: body.update_supplier_name,
        supplier_contactnum: body.update_contact_information,
        supplier_address: body.update_supplier_address,
      },
    });

    console.log("Updated Supplier:", updatedSupplier);

    // Return the updated supplier details
    return {
      statusCode: 200,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    };

  } catch (error) {
    console.error("Error updating supplier:");
    return {
      statusCode: 400,
      message: 'Failed to update supplier',
    };
  }
});
