import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { first_name, last_name, dob, gender_id, contact_info } = body; // Updated field name

    // Log input for debugging
    console.log('Input Data:', body);

    // Convert and validate date
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
        return {
            status: 400,
            message: 'Invalid date format',
        };
    }
    const isoDate = dateOfBirth.toISOString();

    try {
        // Find the gender record using the provided gender_id
        const genderRecord = await prisma.gender.findUnique({
            where: {
                id: parseInt(gender_id), // Use gender_id to fetch the record
            },
        });

        if (!genderRecord) {
            return {
                status: 404,
                message: 'Gender not found',
            };
        }

        // Create a new client in the database
        const newClient = await prisma.client.create({
            data: {
                first_name,
                last_name,
                dob: isoDate,
                gender_id: genderRecord.id, // Use the found gender ID
                contact_info,
            },
        });

        // Log the created client for debugging
        console.log('New Client Created:', newClient);

        // Return a success response
        return {
            status: 201,
            message: 'Client created successfully',
            data: newClient,
        };
    } catch (error) {
        // Log the error
        console.error('Error creating client:', error);

        // Return a generic error message
        return {
            status: 500,
            message: 'Failed to create client. Please try again later.',
        };
    }
});
