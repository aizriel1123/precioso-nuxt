import prisma from "~/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        Gender: true,
        Transaction: {
          include: {
            Appointment: {
              include: {
                Service: true,
                AppointmentStatus: true,
              },
            },
            ModeOfPayment: true,
            Therapist: true,
          },
        },
      },
    });
    
    return new Response(JSON.stringify(clients), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch clients' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await prisma.client.create({
      data: {
        first_name: body.firstName,
        last_name: body.lastName,
        dob: new Date(body.dateOfBirth),
        gender_id: parseInt(body.gender_id),
        contact_info: body.contactInfo,
      },
    });

    return new Response(JSON.stringify(client), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create client' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Example handler for your POST request
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { dob } = body;

    // Log DOB for debugging
    console.log('DOB Value:', dob);

    // Convert and validate date
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
        throw new Error('Invalid date format');
    }

    // Proceed with the rest of your logic
    const isoDate = dateOfBirth.toISOString();

    // ... rest of your API logic here
});