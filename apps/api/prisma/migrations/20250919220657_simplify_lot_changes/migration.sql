/*
  Warnings:

  - A unique constraint covering the columns `[assetMergeId,appliedToAccount]` on the table `LotChangeList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."LotChangeList" DROP CONSTRAINT "LotChangeList_usedByAssetMergeId_fkey";

-- AlterTable
ALTER TABLE "public"."LotChangeList" ADD COLUMN     "appliedToAccount" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "LotChangeList_assetMergeId_appliedToAccount_key" ON "public"."LotChangeList"("assetMergeId", "appliedToAccount");
