-- DropForeignKey
ALTER TABLE "Stockin" DROP CONSTRAINT "Stockin_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "Stockin" DROP CONSTRAINT "Stockin_therapist_id_fkey";

-- AlterTable
ALTER TABLE "Stockin" ALTER COLUMN "therapist_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stockin" ADD CONSTRAINT "Stockin_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stockin" ADD CONSTRAINT "Stockin_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
