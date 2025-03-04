import prisma from "~/lib/prisma";

const genders = [
  { gender: "Male" },
  { gender: "Female" },
  { gender: "Other" },
  { gender: "N/A" },
];

const modeOfPayment = [
  { mode: "Cash" },
  { mode: "Gcash" },
  { mode: "Bank Transfer" },
];

const therapistStatus = [
  { status: "Available" },
  { status: "Unavailable" },
  { status: "Occupied" },
];

const therapistType = [
  { type: "Full Body" },
  { type: "Torso" },
  { type: "Hands" },
];

const accountType = [
  { type: "Admin" },
  { type: "Cashier" },
  { type: "Guest" },
];

const productType = [
  { type: "Disposable" },
  { type: "Soap" },
  { type: "Oil" },
];

const therapists = [
  {
    first_name: "therapist6",
    gender_id: 1,
    status_id: 1,
    type_id: 1,
  },
  {
    first_name: "therapist7",
    gender_id: 2,
    status_id: 1,
    type_id: 1,
  },
  {
    first_name: "therapist8",
    gender_id: 1,
    status_id: 1,
    type_id: 1,
  },
];

const accounts = [
  {
    username: "admin123",
    password: "admin123",
    therapist_id: 1,
    type_id: 1,
  },
  {
    username: "guest123",
    password: "guest123",
    therapist_id: 1,
    type_id: 1,
  },
  {
    username: "davidgwapo",
    password: "davidgwapo",
    therapist_id: 1,
    type_id: 1,
  },
  {
    username: "carloisthebest",
    password: "carloisthebest",
    therapist_id: 1,
    type_id: 1,
  },
];

const clientData = [
  {
    first_name: "LeBron",
    last_name: "James",
    dob: "1984-12-30T00:00:00.000Z",
    gender: "Male",
    contact_info: "08042981",
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    dob: "1990-05-15T00:00:00.000Z",
    gender: "Female",
    contact_info: "08012345",
  },
  {
    first_name: "Alex",
    last_name: "Smith",
    dob: "1987-11-12T00:00:00.000Z",
    gender: "Other",
    contact_info: "08067890",
  },
];

const seed = async () => {
  // Seed genders
  for (const gender of genders) {
    await prisma.gender.upsert({
      where: {
        gender: gender.gender,
      },
      update: {},
      create: gender,
    });
  }

  // Seed payment modes
  for (const mode of modeOfPayment) {
    await prisma.modeOfPayment.upsert({
      where: {
        mode: mode.mode,
      },
      update: {},
      create: mode,
    });
  }

  // Seed therapist statuses
  for (const status of therapistStatus) {
    await prisma.therapistStatus.upsert({
      where: {
        status: status.status,
      },
      update: {},
      create: status,
    });
  }

  // Seed therapist types
  for (const type of therapistType) {
    await prisma.therapistType.upsert({
      where: { type: type.type },
      update: {},
      create: type,
    });
  }

  // Seed product types
  for (const type of productType) {
    await prisma.productType.upsert({
      where: {
        type: type.type,
      },
      update: {},
      create: type,
    });
  }

  // Seed clients with gender lookup
  for (const client of clientData) {
    const genderRecord = await prisma.gender.findUnique({
      where: {
        gender: client.gender,
      },
    });

    if (!genderRecord) {
      console.error(`Gender "${client.gender}" not found for client ${client.first_name} ${client.last_name}.`);
      continue;
    }

    await prisma.client.upsert({
      where: {
        contact_info: client.contact_info,
      },
      update: {
        first_name: client.first_name,
        last_name: client.last_name,
        dob: client.dob,
        gender_id: genderRecord.id,
      },
      create: {
        first_name: client.first_name,
        last_name: client.last_name,
        dob: client.dob,
        gender_id: genderRecord.id,
        contact_info: client.contact_info,
      },
    });
  }

  // Seed therapists
  for (const therapist of therapists) {
    const existingTherapist = await prisma.therapist.findFirst({
      where: {
        first_name: therapist.first_name,
        gender_id: therapist.gender_id,
        status_id: therapist.status_id,
      },
      select: {
        id: true,
      },
    });

    if (!existingTherapist) {
      await prisma.therapist.create({
        data: therapist,
      });
    }
  }

  // Seed accounts
  for (const account of accounts) {
    const existingAccount = await prisma.account.findFirst({
      where: {
        username: account.username,
        password: account.password,
        therapist_id: account.therapist_id,
      },
      select: {
        id: true,
      },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: account,
      });
    }
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

  