/*
  Warnings:

  - You are about to drop the column `assetMergeId` on the `LotChange` table. All the data in the column will be lost.
  - You are about to drop the column `chosenByAssetMergeId` on the `LotChange` table. All the data in the column will be lost.
  - You are about to drop the column `mergeErrorId` on the `LotChange` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAssetMergeId` on the `LotChange` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LotChange" DROP CONSTRAINT "LotChange_chosenByAssetMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotChange" DROP CONSTRAINT "LotChange_mergeErrorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotChange" DROP CONSTRAINT "LotChange_resolvedAssetMergeId_fkey";

-- DropIndex
DROP INDEX "public"."LotChange_chosenByAssetMergeId_key";

-- DropIndex
DROP INDEX "public"."LotChange_resolvedAssetMergeId_idx";

-- AlterTable
ALTER TABLE "public"."LotChange" DROP COLUMN "assetMergeId",
DROP COLUMN "chosenByAssetMergeId",
DROP COLUMN "mergeErrorId",
DROP COLUMN "resolvedAssetMergeId",
ADD COLUMN     "lotChangeListId" UUID;

-- CreateTable
CREATE TABLE "public"."LotChangeList" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assetMergeId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "usedByAssetMergeId" UUID,

    CONSTRAINT "LotChangeList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LotChangeList_usedByAssetMergeId_key" ON "public"."LotChangeList"("usedByAssetMergeId");

-- CreateIndex
CREATE INDEX "LotChange_lotChangeListId_idx" ON "public"."LotChange"("lotChangeListId");

-- AddForeignKey
ALTER TABLE "public"."LotChangeList" ADD CONSTRAINT "LotChangeList_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChangeList" ADD CONSTRAINT "LotChangeList_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChangeList" ADD CONSTRAINT "LotChangeList_usedByAssetMergeId_fkey" FOREIGN KEY ("usedByAssetMergeId") REFERENCES "public"."AssetMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChangeList" ADD CONSTRAINT "LotChangeList_assetMergeId_fkey" FOREIGN KEY ("assetMergeId") REFERENCES "public"."AssetMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_lotChangeListId_fkey" FOREIGN KEY ("lotChangeListId") REFERENCES "public"."LotChangeList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
