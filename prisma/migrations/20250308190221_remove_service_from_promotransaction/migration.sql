/*
  Warnings:

  - The primary key for the `PromoTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `service_id` on the `PromoTransaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromoTransaction" DROP CONSTRAINT "PromoTransaction_service_id_fkey";

-- AlterTable
ALTER TABLE "PromoTransaction" DROP CONSTRAINT "PromoTransaction_pkey",
DROP COLUMN "service_id",
ADD CONSTRAINT "PromoTransaction_pkey" PRIMARY KEY ("transaction_id", "promo_id");
