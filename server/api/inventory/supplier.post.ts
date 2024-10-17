import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get data form body
	const body = await readBody(event);
    console.log(body)

    // Implement Validation


    // Create
    const obj = await prisma.supplier.create({
        data: {
            supplier_name: body.new_supplier_name,
            supplier_contactnum: body.contact_number,
            supplier_address: body.supplier_address,
        }
    })

    return {
        hatdog: "hehe"
    }
});

// Sample

// export default defineEventHandler(async (event) => {
// 	// Get data form body
// 	const body = await readBody(event);

// 	// validate
// 	let { error } = BookSchema.validate(body);
// 	if (error) {
// 		throw createError({
// 			message: error.message.replace(/"/g, ""),
// 			statusCode: 400,
// 			fatal: false,
// 		});
// 	}

// 	// create book
// 	try {
// 		await BookModel.create(body);
// 		return { message: "Book created" };
// 	} catch (e) {
// 		throw createError({
// 			message: e.message,
// 		});
// 	}
// });