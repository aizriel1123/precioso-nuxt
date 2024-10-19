import prisma from "~/lib/prisma";

const genders = [
  { gender: "Male" },
  { gender: "Female" },
  { gender: "N/A" },
];

const modeOf = [
  { mode: "Cash" },
  { mode: "Gcash" },
  { mode: "Bank Transfer" },
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
]

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
]

const seed = async () => {
  for (const gender of genders) {
    await prisma.gender.upsert({
      where: {
        gender: gender.gender
      },
      update: {},
      create: gender,
    });
  }

  for (const mode of modeOf) {
    await prisma.modeOfPayment.upsert({
      where: {
        mode: mode.mode
      },
      update: {},
      create: mode,
    });
  }

  for (const status of tStatus) {
    await prisma.therapistStatus.upsert({
      where: {
        status: status.status
      },
      update: {},
      create: status,
    });
  }

  for (const type of tType) {
    await prisma.therapistType.upsert({
      where: {
        type: type.type
      },
      update: {},
      create: type,
    });
  }

  for (const type of aType) {
    await prisma.accountType.upsert({
      where: {
        type: type.type
      },
      update: {},
      create: type,
    });
  }

  for (const therapist of therapists) {
    const acc = await prisma.therapist.findFirst({
      where: {
        first_name: therapist.first_name,
        gender_id: therapist.gender_id,
        status_id: therapist.status_id,
        type_id: therapist.type_id,
      },
      select: {
        id: true,
      }
    })

    if (!acc) {
      await prisma.therapist.create({
        data: therapist
      });
    }
  }

  for (const account of accounts) {
    const acc = await prisma.account.findFirst({
      where: {
        username: account.username,
        password: account.password,
        therapist_id: account.therapist_id,
        type_id: account.type_id,
      },
      select: {
        id: true,
      }
    })

    if (!acc) {
      await prisma.account.create({
        data: account
      });
    }
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });