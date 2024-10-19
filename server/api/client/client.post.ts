import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get data form body
    const body = await readBody(event);
    console.log(body)

    // Implement Validation

    //Convert Date of Birth to Date Format
    const dob = new Date(body.date_of_birth);

    //Create
    const obj = await prisma.client.create({
        data: {
            first_name: body.first_name,
            last_name: body.last_name,
            dob: dob.toISOString(),
            contact_info: body.contact_information,
            Gender:{
                connect:{
                    gender: body.gender,
                }
            },
            Transaction:{
                // Fill in with transaction details
            }
        }
    })

    return {
        hatdog: "hehe"
    }
});