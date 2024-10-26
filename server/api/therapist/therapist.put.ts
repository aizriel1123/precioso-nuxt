import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Parse the request body
  const body = await readBody(event);
  console.log(body)
  try {
    // Check if all necessary fields are provided
    if (!body.update_id || !body.update_product_name || !body.update_product_type) {
      throw new Error('Missing required fields');
    }

    // Update the product using Prisma ORM
    const updateTherapist = await prisma.therapist.update({
      where: {
        id: body.update_id,
      },
      data: {
        // id: body.update_id,
        first_name: body.update_first_name,
        last_name: body.update_last_name,
        dob: body.update_dob,
        contactinfo: body.update_contactinfo,
        schedule: body.update_schedule,
        Gender: {
          connect: {
            gender: body.update_gender,
          },
        },
        TherapistStatus: {
          connect: {
            status: body.update_status,
          },
        },
      },
    });

    console.log(updateTherapist)
    console.log("No")

    // Return the updated product details
    return {
      statusCode: 200,
      message: 'Product updated successfully',
      data: updateTherapist,
    };
  } catch (error) {
    // Handle errors and return error response
    console.log(error)
    return {
      statusCode: 400,
    };
  }
});