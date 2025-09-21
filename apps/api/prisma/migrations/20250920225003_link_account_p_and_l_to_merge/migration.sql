/*
  Warnings:

  - Added the required column `plaidMergeId` to the `AccountRealizedPAndLHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD COLUMN     "plaidMergeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_plaidMergeId_fkey" FOREIGN KEY ("plaidMergeId") REFERENCES "public"."PlaidMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
