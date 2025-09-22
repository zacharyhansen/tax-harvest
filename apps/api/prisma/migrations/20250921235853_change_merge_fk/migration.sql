/*
  Warnings:

  - You are about to drop the column `assetMergeId` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - Added the required column `plaidMergeId` to the `AccountRealizedPAndLHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP CONSTRAINT "AccountRealizedPAndLHistory_assetMergeId_fkey";

-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP COLUMN "assetMergeId",
ADD COLUMN     "plaidMergeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_plaidMergeId_fkey" FOREIGN KEY ("plaidMergeId") REFERENCES "public"."PlaidMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
