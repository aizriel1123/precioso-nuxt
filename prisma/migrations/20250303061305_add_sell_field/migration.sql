/*
  Warnings:

  - A unique constraint covering the columns `[supplier_name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sell" DECIMAL(6,2) NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_name_key" ON "Supplier"("supplier_name");
