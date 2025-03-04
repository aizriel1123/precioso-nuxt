/*
  Warnings:

  - A unique constraint covering the columns `[contact_info]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_contact_info_key" ON "Client"("contact_info");
