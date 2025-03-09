-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_therapist_id_fkey";

-- DropIndex
DROP INDEX "Therapist_first_name_key";

-- DropIndex
DROP INDEX "Therapist_last_name_key";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
