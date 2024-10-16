import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get data form body
    const body = await readBody(event);
    console.log(body)

    // Implement Validation


    // Create
    const obj = await prisma.client.create({
        data: {
            
        }
    })

    return {
        hatdog: "hehe"
    }
});