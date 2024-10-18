import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get data form body
	const body = await readBody(event);
    console.log(body)

    // Implement Validation


    // Create
    const obj = await prisma.product.create({
        data: {
            name: body.new_product_name,
            cost: body.new_product_cost,
            commission: body.new_commission_rate,
            ProductType:{
                connect:{
                    type: body.product_type
                }
            },
            StockinProduct:{
                create:{
                    quantity: body.new_stock_level,

                }
            }
        }
    })
    // {
    //     supplier_name: '15',
    //     new_product_name: 'David',
    //     category: 'services',
    //     new_stock_level: 555,
    //     new_commission_rate: 15 }
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