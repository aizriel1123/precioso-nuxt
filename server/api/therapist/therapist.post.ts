import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // Get data form body
	const body = await readBody(event);
    console.log(body)
})