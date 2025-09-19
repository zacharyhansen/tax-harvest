/*
  Warnings:

  - You are about to drop the `LotChangeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LotTransactionBatch` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."MergeErrorType" ADD VALUE 'UNKNOWN';

-- DropForeignKey
ALTER TABLE "public"."LotChangeLog" DROP CONSTRAINT "LotChangeLog_lotId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotChangeLog" DROP CONSTRAINT "LotChangeLog_lotTransactionBatchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotChangeLog" DROP CONSTRAINT "LotChangeLog_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotChangeLog" DROP CONSTRAINT "LotChangeLog_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotTransactionBatch" DROP CONSTRAINT "LotTransactionBatch_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotTransactionBatch" DROP CONSTRAINT "LotTransactionBatch_logTrxMergeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LotTransactionBatch" DROP CONSTRAINT "LotTransactionBatch_portfolioId_fkey";

-- AlterTable
ALTER TABLE "public"."MergeError" ALTER COLUMN "logId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."LotChangeLog";

-- DropTable
DROP TABLE "public"."LotTransactionBatch";

-- CreateTable
CREATE TABLE "public"."PlaidMerge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,

    CONSTRAINT "PlaidMerge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LotMerge" (
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

    CONSTRAINT "LotMerge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransactionOnLotMerge" (
    "lotMergeId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,

    CONSTRAINT "TransactionOnLotMerge_pkey" PRIMARY KEY ("lotMergeId","transactionId","portfolioId")
);

-- CreateTable
CREATE TABLE "public"."ResolvedLotMerge" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operationType" "public"."OperationType" NOT NULL,
    "accountId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "lotMergeId" UUID NOT NULL,
    "lotChanges" JSONB NOT NULL,
    "chosenLotChange" JSONB,
    "error" JSONB,
    "realizedProfitAndLossShortTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "realizedProfitAndLossLongTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "mergeErrorId" UUID,

    CONSTRAINT "ResolvedLotMerge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LotChange" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "resolvedLotMergeId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "lotId" UUID,
    "quantityFinal" DECIMAL(14,4) NOT NULL,
    "quantityChange" DECIMAL(14,4) NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "shouldDelete" BOOLEAN NOT NULL,
    "upsert" JSONB NOT NULL,

    CONSTRAINT "LotChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LotMerge_portfolioId_createdAt_idx" ON "public"."LotMerge"("portfolioId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ResolvedLotMerge_lotMergeId_idx" ON "public"."ResolvedLotMerge"("lotMergeId");

-- CreateIndex
CREATE INDEX "LotChange_resolvedLotMergeId_idx" ON "public"."LotChange"("resolvedLotMergeId");

-- AddForeignKey
ALTER TABLE "public"."PlaidMerge" ADD CONSTRAINT "PlaidMerge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaidMerge" ADD CONSTRAINT "PlaidMerge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotMerge" ADD CONSTRAINT "LotMerge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotMerge" ADD CONSTRAINT "LotMerge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotMerge" ADD CONSTRAINT "LotMerge_logTrxMergeId_fkey" FOREIGN KEY ("logTrxMergeId") REFERENCES "public"."Log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotMerge" ADD CONSTRAINT "LotMerge_plaidMergeId_fkey" FOREIGN KEY ("plaidMergeId") REFERENCES "public"."PlaidMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotMerge" ADD CONSTRAINT "LotMerge_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "public"."Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" ADD CONSTRAINT "TransactionOnLotMerge_lotMergeId_fkey" FOREIGN KEY ("lotMergeId") REFERENCES "public"."LotMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" ADD CONSTRAINT "TransactionOnLotMerge_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" ADD CONSTRAINT "TransactionOnLotMerge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResolvedLotMerge" ADD CONSTRAINT "ResolvedLotMerge_lotMergeId_fkey" FOREIGN KEY ("lotMergeId") REFERENCES "public"."LotMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResolvedLotMerge" ADD CONSTRAINT "ResolvedLotMerge_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResolvedLotMerge" ADD CONSTRAINT "ResolvedLotMerge_mergeErrorId_fkey" FOREIGN KEY ("mergeErrorId") REFERENCES "public"."MergeError"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_resolvedLotMergeId_fkey" FOREIGN KEY ("resolvedLotMergeId") REFERENCES "public"."ResolvedLotMerge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "public"."Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
