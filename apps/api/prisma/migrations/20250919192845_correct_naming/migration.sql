/*
  Warnings:

  - You are about to drop the column `resolvedLotMergeId` on the `LotChange` table. All the data in the column will be lost.
  - You are about to drop the `LotMerge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResolvedLotMerge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionOnLotMerge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chosenByAssetMergeId]` on the table `LotChange` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resolvedAssetMergeId` to the `LotChange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."LotChange" DROP CONSTRAINT "LotChange_resolvedLotMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotMerge" DROP CONSTRAINT "LotMerge_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotMerge" DROP CONSTRAINT "LotMerge_assetSymbol_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotMerge" DROP CONSTRAINT "LotMerge_logTrxMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotMerge" DROP CONSTRAINT "LotMerge_plaidMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotMerge" DROP CONSTRAINT "LotMerge_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResolvedLotMerge" DROP CONSTRAINT "ResolvedLotMerge_lotMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResolvedLotMerge" DROP CONSTRAINT "ResolvedLotMerge_mergeErrorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResolvedLotMerge" DROP CONSTRAINT "ResolvedLotMerge_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" DROP CONSTRAINT "TransactionOnLotMerge_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" DROP CONSTRAINT "TransactionOnLotMerge_lotMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" DROP CONSTRAINT "TransactionOnLotMerge_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" DROP CONSTRAINT "TransactionOnLotMerge_transactionId_fkey";

-- DropIndex
DROP INDEX "public"."LotChange_resolvedLotMergeId_idx";

-- AlterTable
ALTER TABLE "public"."LotChange" DROP COLUMN "resolvedLotMergeId",
ADD COLUMN     "assetMergeId" UUID,
ADD COLUMN     "chosenByAssetMergeId" UUID,
ADD COLUMN     "mergeErrorId" UUID,
ADD COLUMN     "resolvedAssetMergeId" UUID NOT NULL;

-- DropTable
DROP TABLE "public"."LotMerge";

-- DropTable
DROP TABLE "public"."ResolvedLotMerge";

-- DropTable
DROP TABLE "public"."TransactionOnLotMerge";

-- CreateTable
CREATE TABLE "public"."AssetMerge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "plaidMergeId" UUID NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "logTrxMergeId" BIGINT,
    "targetValue" DECIMAL(14,4),
    "targetQuantity" DECIMAL(14,4),
    "targetPositionSnapshot" JSONB NOT NULL,
    "lotData" JSONB NOT NULL,
    "resolvedLotChange" JSONB NOT NULL,
    "realizedProfitAndLossShortTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "realizedProfitAndLossLongTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "mergeErrorId" UUID,
    "error" JSONB,

    CONSTRAINT "AssetMerge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransactionOnAssetMerge" (
    "assetMergeId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,

    CONSTRAINT "TransactionOnAssetMerge_pkey" PRIMARY KEY ("assetMergeId","transactionId")
);

-- CreateIndex
CREATE INDEX "AssetMerge_portfolioId_createdAt_idx" ON "public"."AssetMerge"("portfolioId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "LotChange_chosenByAssetMergeId_key" ON "public"."LotChange"("chosenByAssetMergeId");

-- CreateIndex
CREATE INDEX "LotChange_resolvedAssetMergeId_idx" ON "public"."LotChange"("resolvedAssetMergeId");

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_mergeErrorId_fkey" FOREIGN KEY ("mergeErrorId") REFERENCES "public"."MergeError"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_logTrxMergeId_fkey" FOREIGN KEY ("logTrxMergeId") REFERENCES "public"."Log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_plaidMergeId_fkey" FOREIGN KEY ("plaidMergeId") REFERENCES "public"."PlaidMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "public"."Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnAssetMerge" ADD CONSTRAINT "TransactionOnAssetMerge_assetMergeId_fkey" FOREIGN KEY ("assetMergeId") REFERENCES "public"."AssetMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnAssetMerge" ADD CONSTRAINT "TransactionOnAssetMerge_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnAssetMerge" ADD CONSTRAINT "TransactionOnAssetMerge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnAssetMerge" ADD CONSTRAINT "TransactionOnAssetMerge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_chosenByAssetMergeId_fkey" FOREIGN KEY ("chosenByAssetMergeId") REFERENCES "public"."AssetMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_resolvedAssetMergeId_fkey" FOREIGN KEY ("resolvedAssetMergeId") REFERENCES "public"."AssetMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_mergeErrorId_fkey" FOREIGN KEY ("mergeErrorId") REFERENCES "public"."MergeError"("id") ON DELETE SET NULL ON UPDATE CASCADE;
