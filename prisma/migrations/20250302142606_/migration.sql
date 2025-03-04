/*
  Warnings:

  - Added the required column `product_id` to the `Stockin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Stockin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stockin" ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Stockin" ADD CONSTRAINT "Stockin_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
