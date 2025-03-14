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
    commission_rate_id: 2,
    sell: 20.00,
    product_type_id: 28,
    critical_level: 5,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Glass Skin Cream",
    cost: 8.00,
    commission_rate_id: 1,
    sell: 12.00,
    product_type_id: 1,
    critical_level: 8,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Melasma Cream",
    cost: 10.00,
    commission_rate_id: 1,
    sell: 15.00,
    product_type_id: 1,
    critical_level: 6,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Day Cream 2in1",
    cost: 9.00,
    commission_rate_id: 1,
    sell: 13.00,
    product_type_id: 1,
    critical_level: 7,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Day Cream 5in1",
    cost: 12.00,
    commission_rate_id: 2,
    sell: 17.00,
    product_type_id: 1,
    critical_level: 6,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "U-vest (Sunblock)",
    cost: 14.00,
    commission_rate_id: 2,
    sell: 19.00,
    product_type_id: 1,
    critical_level: 5,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Bleaching Cream",
    cost: 11.00,
    commission_rate_id: 2,
    sell: 16.00,
    product_type_id: 1,
    critical_level: 6,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Collagen Cream (Co2)",
    cost: 18.00,
    commission_rate_id: 3,
    sell: 24.00,
    product_type_id: 1,
    critical_level: 4,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
  {
    name: "Collagen Cream",
    cost: 16.00,
    commission_rate_id: 3,
    sell: 22.00,
    product_type_id: 1,
    critical_level: 4,
    stockin: 10,
    supplier_id: 1, // supplier id for this product
  },
];

//Therapists

const therapistsFlood = [
  {
    first_name: "Christine",
    last_name: "Marcelino",
    dob: new Date("1990-05-12"),
    contactinfo: "09171234567",
    schedule: "9AM-5PM",
    gender_id: 2,
    status_id: 1,
    type_id: 1,
  },
  {
    first_name: "Judyvie",
    last_name: "Mendez",
    dob: new Date("1988-08-23"),
    contactinfo: "09281234567",
    schedule: "10AM-6PM",
    gender_id: 2,
    status_id: 2,
    type_id: 2,
  },
  {
    first_name: "Iris",
    last_name: "Andrade",
    dob: new Date("1992-03-15"),
    contactinfo: "09391234567",
    schedule: "11AM-7PM",
    gender_id: 2,
    status_id: 3,
    type_id: 3,
  },
  {
    first_name: "Janice",
    last_name: "Viray",
    dob: new Date("1995-07-10"),
    contactinfo: "09451234567",
    schedule: "9AM-5PM",
    gender_id: 2,
    status_id: 1,
    type_id: 2,
  },
  {
    first_name: "Amelie",
    last_name: "Uy",
    dob: new Date("1989-12-01"),
    contactinfo: "09561234567",
    schedule: "10AM-6PM",
    gender_id: 2,
    status_id: 2,
    type_id: 1,
  },
  {
    first_name: "Kimberly",
    last_name: "del Mundo",
    dob: new Date("1993-04-18"),
    contactinfo: "09671234567",
    schedule: "11AM-7PM",
    gender_id: 2,
    status_id: 3,
    type_id: 3,
  },
];

//Clients

const clientsFlood = [
  {
    first_name: "LeBron",
    last_name: "James",
    dob: new Date("1984-12-30"),
    contact_info: "09181234567",
    gender_id: 1,
  },
  {
    first_name: "Jung-kook",
    last_name: "Jeon",
    dob: new Date("1997-09-01"),
    contact_info: "09281234567",
    gender_id: 1,
  },
  {
    first_name: "Bretman",
    last_name: "Rock",
    dob: new Date("1998-07-31"),
    contact_info: "09391234567",
    gender_id: 3,
  },
  {
    first_name: "Ryan",
    last_name: "Gosling",
    dob: new Date("1980-11-12"),
    contact_info: "09451234567",
    gender_id: 1,
  },
  {
    first_name: "Lisa",
    last_name: "Manoban",
    dob: new Date("1997-03-27"),
    contact_info: "09561234567",
    gender_id: 2,
  },
  {
    first_name: "Sakura",
    last_name: "Miyawaki",
    dob: new Date("1998-03-19"),
    contact_info: "09671234567",
    gender_id: 2,
  },
  {
    first_name: "Ice",
    last_name: "Spice",
    dob: new Date("2000-01-01"),
    contact_info: "09781234567",
    gender_id: 2,
  },
  {
    first_name: "Yuri",
    last_name: "Lowenthal",
    dob: new Date("1971-03-05"),
    contact_info: "09891234567",
    gender_id: 1,
  },
  {
    first_name: "Sam",
    last_name: "Smith",
    dob: new Date("1992-05-19"),
    contact_info: "09991234567",
    gender_id: 3,
  },
  {
    first_name: "Yujin",
    last_name: "Ahn",
    dob: new Date("2003-09-01"),
    contact_info: "09102345678",
    gender_id: 2,
  },
  {
    first_name: "Haewon",
    last_name: "Oh",
    dob: new Date("2003-02-25"),
    contact_info: "09203456789",
    gender_id: 2,
  },
  {
    first_name: "Tsuda",
    last_name: "Kenjiro",
    dob: new Date("1971-06-11"),
    contact_info: "09304567891",
    gender_id: 1,
  },
  {
    first_name: "Rie",
    last_name: "Takahashi",
    dob: new Date("1994-02-27"),
    contact_info: "09405678912",
    gender_id: 2,
  },
  {
    first_name: "Wonyoung",
    last_name: "Jang",
    dob: new Date("2004-08-31"),
    contact_info: "09506789123",
    gender_id: 2,
  },
  {
    first_name: "Ji-woo",
    last_name: "Kim",
    dob: new Date("1999-10-20"),
    contact_info: "09607891234",
    gender_id: 3,
  },
  {
    first_name: "Nicolette",
    last_name: "Vergara",
    dob: new Date("2001-09-14"),
    contact_info: "09708912345",
    gender_id: 2,
  },
  {
    first_name: "Jin-Woo",
    last_name: "Sung",
    dob: new Date("2003-03-08"),
    contact_info: "09809123456",
    gender_id: 1,
  },
  {
    first_name: "Shai",
    last_name: "Gilgeous-Alexander",
    dob: new Date("1998-07-12"),
    contact_info: "09910234567",
    gender_id: 1,
  },
  {
    first_name: "Jimmy",
    last_name: "Butler III",
    dob: new Date("1989-09-14"),
    contact_info: "09111234567",
    gender_id: 1,
  },
];

//Accounts

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

//Suppliers

const suppliersFlood = [
  {
    supplier_name: "Dermatech Pro Supplies",
    supplier_contactnum: "+1 (213) 555-7812",
    supplier_email: "sales@dermatechpro.com",
    supplier_address: "145 Radiance Blvd, Los Angeles, CA 90015, USA",
  },
  {
    supplier_name: "Elite Aesthetic Distributors",
    supplier_contactnum: "+1 (305) 555-9910",
    supplier_email: "info@eliteaestheticdistributors.com",
    supplier_address: "908 Serenity Lane, Miami, FL 33140, USA",
  },
  {
    supplier_name: "Seoul DermaTech",
    supplier_contactnum: "+82 2-555-6741",
    supplier_email: "support@seouldermatech.kr",
    supplier_address: "47 Gangnam-daero, Gangnam-gu, Seoul 06035, South Korea",
  },
  {
    supplier_name: "Manila Beauty Systems",
    supplier_contactnum: "+63 (2) 555-9988",
    supplier_email: "inquiry@manilabeautysystems.ph",
    supplier_address: "88 Makati Avenue, Makati City, Metro Manila 1229, Philippines",
  },
  {
    supplier_name: "SkinGlow Equipment & Supplies",
    supplier_contactnum: "+1 (646) 555-8745",
    supplier_email: "sales@skinglowequip.com",
    supplier_address: "322 Aesthetic Street, New York, NY 10012, USA",
  },
  {
    supplier_name: "MedSpa Innovations",
    supplier_contactnum: "+65 6555 4455",
    supplier_email: "contact@medspainnovations.sg",
    supplier_address: "99 Orchard Road, Singapore 238888",
  },
  {
    supplier_name: "Prestige Beauty Equipment",
    supplier_contactnum: "+1 (206) 555-2109",
    supplier_email: "hello@prestigebeautyequip.com",
    supplier_address: "450 Elegance Road, Seattle, WA 98101, USA",
  },
  {
    supplier_name: "HydroGlow Technologies Korea",
    supplier_contactnum: "+82 2-888-7777",
    supplier_email: "sales@hydroglow.kr",
    supplier_address: "15 Itaewon-ro, Yongsan-gu, Seoul 04391, South Korea",
  },
  {
    supplier_name: "LuxeSpa Distributors Philippines",
    supplier_contactnum: "+63 (917) 555-1122",
    supplier_email: "orders@luxespaph.com",
    supplier_address: "78 Bonifacio High Street, Taguig, Metro Manila 1634, Philippines",
  },
  {
    supplier_name: "Dermaluxe Global",
    supplier_contactnum: "+61 2 5556 7890",
    supplier_email: "info@dermaluxeglobal.com",
    supplier_address: "555 Skintastic Ave, Sydney, NSW 2000, Australia",
  },
  {
    supplier_name: "Radiant Beauty Supply Japan",
    supplier_contactnum: "+81 3-5555-9988",
    supplier_email: "support@radiantbeautysupply.jp",
    supplier_address: "1-9-1 Ginza, Chuo City, Tokyo 104-0061, Japan",
  },
];

const promoStatusData = [
  {
    status: "Available",
  },
  {
    status: "Not Available",
  },
];

const commissionRate = [
  {
    rate: 0,
  },
  {
    rate: 5,
  },
  {
    rate: 10,
  },
  {
    rate: 15,
  },
];

const promoFlood = [
  {
    promo: "RF + Lipo Cavi (1 session)",
    price: 1499,
    status_id: 2,
    commission_rate_id: 2,
    description: "Skimming/Firming/Contouring (Body Area)",
  },
  {
    promo: "RF + Lipo Cavi (buy 1 take 1)",
    price: 2499,
    status_id: 2,
    commission_rate_id: 3,
    description: "Skimming/Firming/Contouring (Body Area)",
  },
  {
    promo: "RF + Lipo Cavi (10 sessions)",
    price: 9999,
    status_id: 2,
    commission_rate_id: 4,
    description: "Skimming/Firming/Contouring (Body Area)",
  },
  {
    promo: "RF + IIPO Cavi + Body Sculpting (1 session)",
    price: 3499,
    status_id: 1,
    commission_rate_id: 2,
    description: "Skimming/Firming/Contouring (Body Area)",
  },
  {
    promo: "RF + IIPO Cavi + Body Sculpting (buy 1 take 1)",
    price: 5999,
    status_id: 1,
    commission_rate_id: 3,
    description: "Skimming/Firming/Contouring (Body Area)",
  },
  {
    promo: "RF + IIPO Cavi + Body Sculpting (4+1 sessions)",
    price: 12999,
    status_id: 1,
    commission_rate_id: 4,
    description: "Skimming/Firming/Contouring (Body Area)",
  },
  // {
  //   promo: "RF + Lipo Cavi + Body Sculpting + Meso (1 session)",
  //   price: 3999,
  //   status_id: 2,
  //   commission_rate_id: 2,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "RF + Lipo Cavi + Body Sculpting + Meso (buy 1 take 1)",
  //   price: 7999,
  //   status_id: 2,
  //   commission_rate_id: 3,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "RF + Lipo Cavi + Body Sculpting + Meso (4+1 sessions)",
  //   price: 17999,
  //   status_id: 2,
  //   commission_rate_id: 4,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift (1 session)",
  //   price: 2499,
  //   status_id: 1,
  //   commission_rate_id: 2,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift (buy 1 take 1)",
  //   price: 3499,
  //   status_id: 1,
  //   commission_rate_id: 3,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift (2+1 sessions)",
  //   price: 5499,
  //   status_id: 1,
  //   commission_rate_id: 4,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift + Body Sculpting (1 session)",
  //   price: 4999,
  //   status_id: 1,
  //   commission_rate_id: 2,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift + Body Sculpting (buy 1 take 1)",
  //   price: 7999,
  //   status_id: 1,
  //   commission_rate_id: 3,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift + Body Sculpting (4+1 sessions)",
  //   price: 17499,
  //   status_id: 1,
  //   commission_rate_id: 4,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift + Body Sculpting + Meso (1 session)",
  //   price: 5499,
  //   status_id: 1,
  //   commission_rate_id: 2,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift + Body Sculpting + Meso (buy 1 take 1)",
  //   price: 9999,
  //   status_id: 1,
  //   commission_rate_id: 3,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Exilift + Body Sculpting + Meso (4+2 sessions)",
  //   price: 25999,
  //   status_id: 1,
  //   commission_rate_id: 4,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Sculpting (2 Areas) (1 session)",
  //   price: 3999,
  //   status_id: 2,
  //   commission_rate_id: 2,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Sculpting (2 Areas) (buy 1 take 1)",
  //   price: 5999,
  //   status_id: 2,
  //   commission_rate_id: 3,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
  // {
  //   promo: "Sculpting (2 Areas) (4+2 sessions)",
  //   price: 12499,
  //   status_id: 2,
  //   commission_rate_id: 4,
  //   description: "Skimming/Firming/Contouring (Body Area)",
  // },
];

const serviceFlood = [
  {
    name: "Facial with Chemical Peel",
    price: 999,
    commission_rate_id: 2, // 5%
    service_type_id: 1,
    description: "Facial Cleaning",
  },
  {
    name: "Facial with Carbon Peel",
    price: 1500,
    commission_rate_id: 3, // 10%
    service_type_id: 1,
    description: "Facial Cleaning",
  },
  {
    name: "RF Face",
    price: 750,
    commission_rate_id: 2, // 5%
    service_type_id: 1,
    description: "Firming and Contouring Services",
  },
  {
    name: "Hifu Vmax",
    price: 999,
    commission_rate_id: 3, // 10%
    service_type_id: 1,
    description: "Firming and Contouring Services",
  },
  {
    name: "Hifu Radar",
    price: 1500,
    commission_rate_id: 4, // 15%
    service_type_id: 1,
    description: "Firming and Contouring Services",
  },
  {
    name: "Dioide Laser",
    price: 2500,
    commission_rate_id: 4, // 15%
    service_type_id: 1,
    description: "Pigmentation Therapy",
  },
  {
    name: "Pico Laser",
    price: 3500,
    commission_rate_id: 4, // 15%
    service_type_id: 1,
    description: "Pigmentation Therapy",
  },
  {
    name: "Dermapen with facial",
    price: 2500,
    commission_rate_id: 3, // 10%
    service_type_id: 1,
    description: "Deep Scars Treatment",
  },
];

async function createSuppliers() {
  try {
    await Promise.all(
      suppliersFlood.map(async (supplier) => {
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
              supplier_email: supplier.supplier_email,
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

  // Seed promo status
  for (const status of promoStatusData) {
    await prisma.promoStatus.upsert({
      where: { status: status.status },
      update: {},
      create: status,
    });
  }

  // Seed commision rate
  for (const rate of commissionRate) {
    await prisma.commissionRate.upsert({
      where: { rate: rate.rate },
      update: {},
      create: rate,
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
            where: { id: product.product_type_id },
          });
  
          if (!productTypeRecord) {
            console.error(`❌ Product type "${product.product_type_id}" not found for product "${product.name}".`);
            return;
          }

          const productCommissionRate = await prisma.commissionRate.findUnique({
            where: { id: product.commission_rate_id },
          });

          if(!productCommissionRate) {
            console.error(`❌ Commission rate "${product.commission_rate_id}" not found for product "${product.name}".`);
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
                commission_rate_id: productCommissionRate.id,
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
  for (const client of clientsFlood) {
    const genderRecord = await prisma.gender.findUnique({
      where: {
        id: client.gender_id,
      },
    });

    if (!genderRecord) {
      console.error(`Gender "${client.gender_id}" not found for client ${client.first_name} ${client.last_name}.`);
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
  for (const therapist of therapistsFlood) {
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
  //Seed Promos
  for (const promo of promoFlood) {
    const promoStatusRecord = await prisma.promoStatus.findUnique({
      where: { 
        id: promo.status_id
      },
    });
    
    if (!promoStatusRecord) {
      console.error(`Promo status "${promo.status_id}" not found for promo "${promo.promo}".`);
      continue;
    }

    const promoCommissionRate = await prisma.commissionRate.findUnique({
      where: { 
        id: promo.commission_rate_id
      },
    });

    if(!promoCommissionRate) {
      console.error(`❌ Commission rate "${promo.commission_rate_id}" not found for promo "${promo.promo}".`);
      return;
    }

    await prisma.promo.upsert({
      where: {
        promo: promo.promo,
      },
      update: {
        price: promo.price,
        status_id: promoStatusRecord.id,
        commission_rate_id: promoCommissionRate.id,
        description: promo.description,
      },
      create: {
        promo: promo.promo,
        price: promo.price,
        status_id: promoStatusRecord.id,
        commission_rate_id: promoCommissionRate.id,
        description: promo.description,
      },
    })
  }
  // Seed Service
  for (const service of serviceFlood) {
    const serviceTypeRecord = await prisma.serviceType.findUnique({
      where: {
        id: service.service_type_id
      },
    });

    if(!serviceTypeRecord) {
      console.error(`Service type "${service.service_type_id}" not found for service "${service.name}".`);
      continue;
    }
      
      const serviceCommissionRate = await prisma.commissionRate.findUnique({
        where: { 
          id: service.commission_rate_id 
        },
      });

      if(!serviceCommissionRate) {
        console.error(`❌ Commission rate "${service.commission_rate_id}" not found for service "${service.name}".`);
        return;
      }

      await prisma.service.upsert({
        where: {
          name: service.name,
        },
        update: {
          price: service.price,
          commission_rate_id: serviceCommissionRate.id,
          service_type_id: serviceTypeRecord.id,
          description: service.description,
        },
        create: {
          name: service.name,
          price: service.price,
          commission_rate_id: serviceCommissionRate.id,
          service_type_id: serviceTypeRecord.id,
          description: service.description,
        },
      });
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
