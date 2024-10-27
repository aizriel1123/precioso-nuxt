import prisma from "~/lib/prisma";
import { createClient } from "~/lib/utils";

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

const pType = [
  { type: "Disposable" },
  { type: "Soap" },
  { type: "Oil" },
];

const therapists = [
  {
    first_name: "therapist6",
    gender_id: 1,
    status_id: 1,
  },
  {
    first_name: "therapist7",
    gender_id: 2,
    status_id: 1,
  },
  {
    first_name: "therapist8",
    gender_id: 1,
    status_id: 1,
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
  {
    username: "carloisthebest",
    password: "carloisthebest",
    therapist_id: 1,
    type_id: 1,
  }
]

const clients = [
  { last_name: 'Doe', first_name: 'John', date_of_birth: '1990-01-01', gender: 'Male', contact_information: '123-456-7890' },
  { last_name: 'Smith', first_name: 'Jane', date_of_birth: '1992-05-10', gender: 'Female', contact_information: '987-654-3210' },
  { last_name: 'Johnson', first_name: 'Alice', date_of_birth: '1988-08-15', gender: 'Female', contact_information: '456-789-0123' },
  { last_name: 'Taylor', first_name: 'Chris', date_of_birth: '1995-12-22', gender: 'Other', contact_information: '555-123-4567' },
  { last_name: 'Doe', first_name: 'John', date_of_birth: '1990-01-01', gender: 'Male', contact_information: '123-456-7890' },
  { last_name: 'Smith', first_name: 'Jane', date_of_birth: '1992-05-10', gender: 'Female', contact_information: '987-654-3210' },
  { last_name: 'Johnson', first_name: 'Alice', date_of_birth: '1988-08-15', gender: 'Female', contact_information: '456-789-0123' },
  { last_name: 'Taylor', first_name: 'Chris', date_of_birth: '1995-12-22', gender: 'Other', contact_information: '555-123-4567' },
  { last_name: 'Doe', first_name: 'John', date_of_birth: '1990-01-01', gender: 'Male', contact_information: '123-456-7890' },
  { last_name: 'Smith', first_name: 'Jane', date_of_birth: '1992-05-10', gender: 'Female', contact_information: '987-654-3210' },
  { last_name: 'Johnson', first_name: 'Alice', date_of_birth: '1988-08-15', gender: 'Female', contact_information: '456-789-0123' },
  { last_name: 'Taylor', first_name: 'Chris', date_of_birth: '1995-12-22', gender: 'Other', contact_information: '555-123-4567' },
  { last_name: 'Doe', first_name: 'John', date_of_birth: '1990-01-01', gender: 'Male', contact_information: '123-456-7890' },
  { last_name: 'Smith', first_name: 'Jane', date_of_birth: '1992-05-10', gender: 'Female', contact_information: '987-654-3210' },
  { last_name: 'Johnson', first_name: 'Alice', date_of_birth: '1988-08-15', gender: 'Female', contact_information: '456-789-0123' },
  { last_name: 'Taylor', first_name: 'Chris', date_of_birth: '1995-12-22', gender: 'Other', contact_information: '555-123-4567' },
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

  for (const type of aType) {
    await prisma.accountType.upsert({
      where: {
        type: type.type
      },
      update: {},
      create: type,
    });
  }

  for (const type of pType) {
    await prisma.productType.upsert({
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

  for (const client of clients){
    createClient(client);
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