import prisma from "~/lib/prisma";
import argon2 from "argon2";
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
  {type: "Cream" },
  { type: "Disposable" },
  { type: "Soap" },
  { type: "Oil" },
  { type: "Fresh Produce" },
  { type: "Dairy Products" },
  { type: "Meat & Poultry" },
  { type: "Frozen Foods" },
  { type: "Snacks" },
  { type: "Beverages" },
  { type: "Canned Goods" },
  { type: "Baking Supplies" },
  { type: "Condiments & Sauces" },
  { type: "Cleaning Supplies" },
  { type: "Paper Products" },
  { type: "Toiletries" },
  { type: "Shampoo & Conditioner" },
  { type: "Toothpaste & Oral Care" },
  { type: "Skincare Products" },
  { type: "Pain Relievers" },
  { type: "First Aid Supplies" },
  { type: "Baby Products" },
  { type: "Pet Supplies" },
  { type: "Office & School Supplies" },
  { type: "Tools & Hardware" },
  { type: "Batteries" },
  { type: "Light Bulbs" },
  { type: "Supplement" }
];

export default productType;
const productData = [
  {
    name: "Glutamine Prime & Life",
    cost: 15.00,
    commission: 2.00,
    sell: 20.00,
    product_type: "Supplement",
    critical_level: 5,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Glass Skin Cream",
    cost: 8.00,
    commission: 1.50,
    sell: 12.00,
    product_type: "Cream",
    critical_level: 8,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Melasma Cream",
    cost: 10.00,
    commission: 1.80,
    sell: 15.00,
    product_type: "Cream",
    critical_level: 6,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Day Cream 2in1",
    cost: 9.00,
    commission: 1.60,
    sell: 13.00,
    product_type: "Cream",
    critical_level: 7,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Day Cream 5in1",
    cost: 12.00,
    commission: 2.00,
    sell: 17.00,
    product_type: "Cream",
    critical_level: 6,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "U-vest (Sunblock)",
    cost: 14.00,
    commission: 2.20,
    sell: 19.00,
    product_type: "Cream",
    critical_level: 5,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Bleaching Cream",
    cost: 11.00,
    commission: 1.90,
    sell: 16.00,
    product_type: "Cream",
    critical_level: 6,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Collagen Cream (Co2)",
    cost: 18.00,
    commission: 2.50,
    sell: 24.00,
    product_type: "Cream",
    critical_level: 4,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Collagen Cream",
    cost: 16.00,
    commission: 2.30,
    sell: 22.00,
    product_type: "Cream",
    critical_level: 4,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
];



const therapists = [
  {
    first_name: "Therapist0",
    gender_id: 1,
    status_id: 1,
    type_id: 1,
  },
  {
    first_name: "Therapist1",
    gender_id: 2,
    status_id: 1,
    type_id: 1,
  },
  {
    first_name: "Therapist",
    gender_id: 1,
    status_id: 1,
    type_id: 1,
  },
  {
    first_name: "therapist2",
    gender_id: 1,
    status_id: 1,
    type_id: 1,
  },
];

const accounts = [
  {
    username: "Administrator",
    password: "Administrator",
    therapist_id: 1,
    type_id: 1,
  },
  {
    username: "admin123",
    password: "admin123",
    therapist_id: 1,
    type_id: 1,
  },
  {
    username: "Employee1",
    password: "employee",
    therapist_id: 1,
    type_id: 0,
  },
  {
    username: "Employee2",
    password: "employee",
    therapist_id: 1,
    type_id: 0,
  },
  {
    username: "Employee3",
    password: "employee",
    therapist_id: 1,
    type_id: 0,
  },
];

const clientData = [
  {
    first_name: "Max",
    last_name: "Lorem",
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
const supplierData = [
  {
    supplier_name: "Supplier1",
    supplier_contactnum: "09123456789",
    supplier_address: "123 Supplier Street, City, Country",
  },
  {
    supplier_name: "Supplier2",
    supplier_contactnum: "09234567890",
    supplier_address: "456 Warehouse Avenue, City, Country",
  },
  {
    supplier_name: "Supplier3",
    supplier_contactnum: "09345678901",
    supplier_address: "789 Distribution Road, City, Country",
  },
];


async function createSuppliers() {
  try {
    await Promise.all(
      supplierData.map(async (supplier) => {
        const existingSupplier = await prisma.supplier.findFirst({
          where: {
            supplier_name: supplier.supplier_name,
            supplier_address: supplier.supplier_address,
          },
          select: { id: true },
        });

        if (!existingSupplier) {
          await prisma.supplier.create({
            data: {
              supplier_name: supplier.supplier_name,
              supplier_contactnum: supplier.supplier_contactnum,
              supplier_address: supplier.supplier_address,
            },
          });

          console.log(`✅ Supplier "${supplier.supplier_name}" added successfully.`);
        } else {
          console.log(`⚠️ Supplier "${supplier.supplier_name}" already exists.`);
        }
      })
    );

    console.log("🎉 Supplier seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding suppliers:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createSuppliers();
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
  // Seed for product creation
  async function createProduct() {
    const defaultSupplierId = 1; // Use the actual default supplier ID from your database
    try {
      await Promise.all(
        productData.map(async (product) => {
          const productTypeRecord = await prisma.productType.findUnique({
            where: { type: product.product_type },
          });
  
          if (!productTypeRecord) {
            console.error(`❌ Product type "${product.product_type}" not found for product "${product.name}".`);
            return;
          }
          
          const existingProduct = await prisma.product.findFirst({
            where: { name: product.name },
            select: { id: true },
          });
  
          if (!existingProduct) {
            await prisma.product.create({
              data: {
                name: product.name,
                cost: product.cost,
                commission: product.commission,
                sell: product.sell,
                product_type_id: productTypeRecord.id,
                critical_level: product.critical_level,
                StockinProduct: {
                  create: [
                    {
                      quantity: product.stockin || 0,
                    },
                  ],
                },
              },
            });
  
            console.log(`✅ Product "${product.name}" added successfully.`);
          } else {
            console.log(`⚠️ Product "${product.name}" already exists.`);
          }
        })
      );
  
      console.log("🎉 Product seeding complete!");
    } catch (error) {
      console.error("❌ Error seeding products:", error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  
  // Run the function
  createProduct();
  
  



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
  // Seed account types
  for (const type of [{ id: 0, type: "0" }, { id: 1, type: "1" }]) {
    await prisma.accountType.upsert({
      where: { type: type.type }, // Type 0 == "USER" && Type 1 == "ADMIN"
      update: {},
      create: type,
    });
  }

  // Seed accounts
  for (const account of accounts) {
    // Hash the password
    const hashedPassword = await argon2.hash(account.password);
  
    // Check if the account already exists (WITHOUT checking the password)
    const existingAccount = await prisma.account.findFirst({
      where: {
        username: account.username,
        therapist_id: account.therapist_id,
      },
      select: {
        id: true,
      },
    });
  
    if (!existingAccount) {
      await prisma.account.create({
        data: {
          ...account,
          password: hashedPassword, // Use the hashed password
        },
      });
    }
  }};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  