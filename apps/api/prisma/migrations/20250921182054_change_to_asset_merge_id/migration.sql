/*
  Warnings:

  - You are about to drop the column `plaidMergeId` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - Added the required column `assetMergeId` to the `AccountRealizedPAndLHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP CONSTRAINT "AccountRealizedPAndLHistory_plaidMergeId_fkey";

-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP COLUMN "plaidMergeId",
ADD COLUMN     "assetMergeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_assetMergeId_fkey" FOREIGN KEY ("assetMergeId") REFERENCES "public"."AssetMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
