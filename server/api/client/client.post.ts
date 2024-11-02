import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { first_name, last_name, dob, gender, contact_info } = body; // Assuming 'gender' is a string like "male" or "female"

    // Log input for debugging
    console.log('Input Data:', body);

    // Convert and validate date
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
        throw new Error('Invalid date format');
    }
    const isoDate = dateOfBirth.toISOString();

    try {
        // Find the gender record using the provided gender value
        const genderRecord = await prisma.gender.findUnique({
            where: {
                gender: gender, // Use the gender string from input
            },
        });

        if (!genderRecord) {
            throw new Error('Gender not found');
        }

        // Example: Create a new client in the database
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

        // Handle different types of errors accordingly
        return {
            status: 500,
            message: 'Failed to create client: ' // Include error message for clarity
        };
    }
});