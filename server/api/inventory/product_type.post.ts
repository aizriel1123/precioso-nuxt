import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get data form body
	const body = await readBody(event);
    console.log(body)

    // Implement Validation
    // Need to add pa

    // Create
    const obj = await prisma.productType.create({
        data: {
            type: body.new_type,
        }
    })
    
    return {
        hatdog: "hehe"
    }
});