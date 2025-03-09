-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_therapist_id_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
