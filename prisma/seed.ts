import prisma from "~/lib/prisma";

// Existing data structures
const genders = [
  { gender: "Male" },
  { gender: "Female" },
  { gender: "N/A" },
];

const modeOf = [
  { mode: "Cash" },
  { mode: "Gcash" },
  { mode: "Bank Transfer" },
  { mode: "Credit Card" },
  { mode: "Debit Card" },
];

const tStatus = [
  { status: "Available" },
  { status: "Unavailable" },
  { status: "Occupied" },
];

const tType = [
  { type: "Full Body" },
  { type: "Torso" },
  { type: "Hands" },
];

const aType = [
  { type: "Admin" },
  { type: "Cashier" },
  { type: "Guest" },
];

const pType = [
  { type: "Disposable" },
  { type: "Soap" },
  { type: "Oil" },
];

// Add service types
const serviceTypes = [
  { type: "Massage" },
  { type: "Facial" },
  { type: "Body Treatment" },
  { type: "Nail Care" },
];

// Add commission rates
const commissionRates = [
  { rate: 0.15 }, // 15%
  { rate: 0.20 }, // 20%
  { rate: 0.25 }, // 25%
];

// Add services
const services = [
  { name: "Full Body Massage", price: 250.00, commission_rate_id: 1, service_type_id: 1 },
  { name: "Deep Tissue Massage", price: 200.00, commission_rate_id: 1, service_type_id: 1 },
  { name: "Swedish Massage", price: 200.00, commission_rate_id: 1, service_type_id: 1 },
  { name: "Facial", price: 120.00, commission_rate_id: 2, service_type_id: 2 },
  { name: "Body Scrub", price: 180.00, commission_rate_id: 2, service_type_id: 3 },
  { name: "Manicure", price: 90.00, commission_rate_id: 3, service_type_id: 4 },
  { name: "Pedicure", price: 90.00, commission_rate_id: 3, service_type_id: 4 },
];

// Add appointment statuses
const appointmentStatuses = [
  { status: "Scheduled" },
  { status: "In Progress" },
  { status: "Completed" },
  { status: "Cancelled" },
];

// Add therapists with more complete data
const therapists = [
  {
    first_name: "John",
    last_name: "Doe",
    gender_id: 1,
    status_id: 1,
    type_id: 1,
    schedule: "9AM-6PM",
    contactinfo: "1234567890"
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    gender_id: 2,
    status_id: 1,
    type_id: 1,
    schedule: "9AM-6PM",
    contactinfo: "1234567891"
  },
  {
    first_name: "Emily",
    last_name: "White",
    gender_id: 2,
    status_id: 1,
    type_id: 1,
    schedule: "9AM-6PM",
    contactinfo: "1234567892"
  },
  {
    first_name: "Anna",
    last_name: "Taylor",
    gender_id: 2,
    status_id: 1,
    type_id: 1,
    schedule: "9AM-6PM",
    contactinfo: "1234567893"
  }
];

// Client data from the Vue component
const clients = [
  {
    first_name: "Ahkmed",
    last_name: "Abdul",
    dob: new Date("2000-01-01"),
    gender_id: 1,
    contact_info: "0909090990"
  },
  {
    first_name: "Sarah",
    last_name: "Johnson",
    dob: new Date("1995-05-15"),
    gender_id: 2,
    contact_info: "0909090991"
  },
  // ... add all other clients from the Vue component
];

const seed = async () => {
  try {
    // Seed basic data structures
    for (const gender of genders) {
      await prisma.gender.upsert({
        where: { gender: gender.gender },
        update: {},
        create: gender,
      });
    }

    for (const mode of modeOf) {
      await prisma.modeOfPayment.upsert({
        where: { mode: mode.mode },
        update: {},
        create: mode,
      });
    }

    for (const status of tStatus) {
      await prisma.therapistStatus.upsert({
        where: { status: status.status },
        update: {},
        create: status,
      });
    }

    for (const type of tType) {
      await prisma.therapistType.upsert({
        where: { type: type.type },
        update: {},
        create: type,
      });
    }

    for (const type of aType) {
      await prisma.accountType.upsert({
        where: { type: type.type },
        update: {},
        create: type,
      });
    }

    for (const type of pType) {
      await prisma.productType.upsert({
        where: { type: type.type },
        update: {},
        create: type,
      });
    }

    // Seed service types
    for (const type of serviceTypes) {
      await prisma.serviceType.upsert({
        where: { id: 1 }, // Adjust as needed
        update: {},
        create: type,
      });
    }

    // Seed commission rates
    for (const rate of commissionRates) {
      await prisma.commissionRate.upsert({
        where: { id: 1 }, // Adjust as needed
        update: {},
        create: rate,
      });
    }

    // Seed appointment statuses
    for (const status of appointmentStatuses) {
      await prisma.appointmentStatus.upsert({
        where: { status: status.status },
        update: {},
        create: status,
      });
    }

    // Seed therapists
    for (const therapist of therapists) {
      const existingTherapist = await prisma.therapist.findFirst({
        where: {
          first_name: therapist.first_name,
          last_name: therapist.last_name,
        },
      });

      if (!existingTherapist) {
        await prisma.therapist.create({
          data: therapist,
        });
      }
    }

    // Seed services
    for (const service of services) {
      await prisma.service.upsert({
        where: { id: 1 }, // Adjust as needed
        update: {},
        create: service,
      });
    }

    // Seed clients and their transactions
    for (const client of clients) {
      const createdClient = await prisma.client.create({
        data: {
          ...client,
          Transaction: {
            create: {
              date: new Date(),
              therapist_id: 1, // Default to first therapist
              mode_of_payment_id: 1, // Default to first payment mode
              Appointment: {
                create: {
                  service_id: 1, // Default to first service
                  appointment_status_id: 3, // Completed
                  quantity: 1,
                }
              }
            }
          }
        }
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });