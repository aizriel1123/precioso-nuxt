import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        console.log("Received Data:", body);

        let type = body.new_type?.trim();

        // Default to predefined sample types if no type is provided
        const sampleTypes = ["Oil", "Toner", "Serum", "Moisturizer", "Cleanser"];

        if (!type) {
            for (const sampleType of sampleTypes) {
                await prisma.productType.upsert({
                    where: { type: sampleType },
                    update: {},
                    create: { type: sampleType },
                });
            }
            return {
                success: true,
                message: "Sample product types added successfully",
                data: sampleTypes,
            };
        }

        // Create new product type
        const obj = await prisma.productType.create({
            data: { type },
        });

        return {
            success: true,
            message: "Product type created successfully",
            data: obj,
        };
    } catch (error) {
        return {
            success: false,
            message:  "An error occurred while creating the product type",
        };
    }
});
