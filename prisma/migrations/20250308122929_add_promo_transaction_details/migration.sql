/*
  Warnings:

  - The primary key for the `PromoTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `service_id` to the `PromoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromoTransaction" DROP CONSTRAINT "PromoTransaction_pkey",
ADD COLUMN     "promo_name" VARCHAR(255),
ADD COLUMN     "promo_price" DECIMAL(6,2),
ADD COLUMN     "service_id" INTEGER NOT NULL,
ADD COLUMN     "service_name" VARCHAR(100),
ADD COLUMN     "service_price" DECIMAL(10,2),
ADD CONSTRAINT "PromoTransaction_pkey" PRIMARY KEY ("transaction_id", "promo_id", "service_id");

-- AddForeignKey
ALTER TABLE "PromoTransaction" ADD CONSTRAINT "PromoTransaction_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
