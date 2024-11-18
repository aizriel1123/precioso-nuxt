-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "therapist_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "AccountType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "transaction_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "appointment_status_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("transaction_id","service_id")
);

-- CreateTable
CREATE TABLE "AppointmentStatus" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(30) NOT NULL,

    CONSTRAINT "AppointmentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "dob" DATE DEFAULT CURRENT_TIMESTAMP,
    "contact_info" VARCHAR(20),
    "gender_id" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionRate" (
    "id" SERIAL NOT NULL,
    "rate" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "CommissionRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Defect" (
    "defective_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "therapist_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Defect_pkey" PRIMARY KEY ("defective_id")
);

-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "gender" VARCHAR(20) NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeOfPayment" (
    "id" SERIAL NOT NULL,
    "mode" VARCHAR(50) NOT NULL,

    CONSTRAINT "ModeOfPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "cost" DECIMAL(6,2) NOT NULL,
    "commission" DECIMAL(6,2) NOT NULL,
    "product_type_id" INTEGER NOT NULL,
    "critical_level" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsSold" (
    "transaction_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "ProductsSold_pkey" PRIMARY KEY ("transaction_id","product_id")
);

-- CreateTable
CREATE TABLE "Promo" (
    "id" SERIAL NOT NULL,
    "promo" VARCHAR(255) NOT NULL,
    "price" DECIMAL(6,2) NOT NULL,
    "commission_rate_id" INTEGER NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoServices" (
    "promo_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "quantity" INTEGER DEFAULT 1,

    CONSTRAINT "PromoServices_pkey" PRIMARY KEY ("promo_id","service_id")
);

-- CreateTable
CREATE TABLE "PromoStatus" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "PromoStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoTransaction" (
    "transaction_id" INTEGER NOT NULL,
    "promo_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,

    CONSTRAINT "PromoTransaction_pkey" PRIMARY KEY ("transaction_id","promo_id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2),
    "commission_rate_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stockin" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "therapist_id" INTEGER NOT NULL,
    "date" DATE,

    CONSTRAINT "Stockin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockinProduct" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "purchase_price" DECIMAL(10,2),

    CONSTRAINT "StockinProduct_pkey" PRIMARY KEY ("id","product_id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "supplier_name" VARCHAR(100) NOT NULL,
    "supplier_contactnum" VARCHAR(20) NOT NULL,
    "supplier_address" VARCHAR(150) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Therapist" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "dob" DATE,
    "contactinfo" VARCHAR(50),
    "schedule" VARCHAR(20),
    "gender_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "Therapist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapistStatus" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "TherapistStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapistType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "TherapistType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMPTZ(6),
    "client_id" INTEGER NOT NULL,
    "therapist_id" INTEGER NOT NULL,
    "mode_of_payment_id" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountType_type_key" ON "AccountType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentStatus_status_key" ON "AppointmentStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Gender_gender_key" ON "Gender"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "ModeOfPayment_mode_key" ON "ModeOfPayment"("mode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_type_key" ON "ProductType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_name_supplier_address_key" ON "Supplier"("supplier_name", "supplier_address");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_first_name_key" ON "Therapist"("first_name");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_last_name_key" ON "Therapist"("last_name");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistStatus_status_key" ON "TherapistStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistType_type_key" ON "TherapistType"("type");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "AccountType"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_appointment_status_id_fkey" FOREIGN KEY ("appointment_status_id") REFERENCES "AppointmentStatus"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ProductsSold" ADD CONSTRAINT "ProductsSold_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ProductsSold" ADD CONSTRAINT "ProductsSold_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_commission_rate_id_fkey" FOREIGN KEY ("commission_rate_id") REFERENCES "CommissionRate"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PromoServices" ADD CONSTRAINT "PromoServices_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "Promo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoServices" ADD CONSTRAINT "PromoServices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PromoTransaction" ADD CONSTRAINT "PromoTransaction_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "Promo"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PromoTransaction" ADD CONSTRAINT "PromoTransaction_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "PromoStatus"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PromoTransaction" ADD CONSTRAINT "PromoTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_commission_rate_id_fkey" FOREIGN KEY ("commission_rate_id") REFERENCES "CommissionRate"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Stockin" ADD CONSTRAINT "Stockin_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stockin" ADD CONSTRAINT "Stockin_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockinProduct" ADD CONSTRAINT "StockinProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Therapist" ADD CONSTRAINT "Therapist_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Therapist" ADD CONSTRAINT "Therapist_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "TherapistStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Therapist" ADD CONSTRAINT "Therapist_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "TherapistType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_mode_of_payment_id_fkey" FOREIGN KEY ("mode_of_payment_id") REFERENCES "ModeOfPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
