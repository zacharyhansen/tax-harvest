/*
  Warnings:

  - Made the column `lotId` on table `LotChange` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."LotChange" DROP CONSTRAINT "LotChange_lotId_fkey";

-- AlterTable
ALTER TABLE "public"."LotChange" ALTER COLUMN "lotId" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."AccountRealizedPAndLHistory" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "realizedPAndLId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "shortTermChange" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "longTermChange" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "dividendChange" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "deferredLossChange" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lotId" UUID,
    "transactionId" UUID,

    CONSTRAINT "AccountRealizedPAndLHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountRealizedPAndLHistory_uuid_key" ON "public"."AccountRealizedPAndLHistory"("uuid");

-- CreateIndex
CREATE INDEX "AccountRealizedPAndLHistory_accountId_realizedPAndLId_idx" ON "public"."AccountRealizedPAndLHistory"("accountId", "realizedPAndLId");

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_realizedPAndLId_fkey" FOREIGN KEY ("realizedPAndLId") REFERENCES "public"."RealizedPAndL"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "public"."Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotChange" ADD CONSTRAINT "LotChange_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "public"."Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
