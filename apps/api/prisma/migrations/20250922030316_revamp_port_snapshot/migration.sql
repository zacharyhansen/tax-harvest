/*
  Warnings:

  - The `positionId` column on the `Lot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `positions` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `realizedPAndLLongTerm` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `realizedPAndLShortTerm` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `valueAssets` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `valueCash` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `valueTotal` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to alter the column `unrealizedLoss` on the `PortfolioBalanceSnapshot` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,4)`.
  - You are about to alter the column `unrealizedProfit` on the `PortfolioBalanceSnapshot` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,4)`.
  - The primary key for the `Position` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Position` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Lot" DROP CONSTRAINT "Lot_positionId_fkey";

-- AlterTable
ALTER TABLE "public"."Lot" DROP COLUMN "positionId",
ADD COLUMN     "positionId" BIGINT;

-- AlterTable
ALTER TABLE "public"."PortfolioBalanceSnapshot" DROP COLUMN "positions",
DROP COLUMN "realizedPAndLLongTerm",
DROP COLUMN "realizedPAndLShortTerm",
DROP COLUMN "valueAssets",
DROP COLUMN "valueCash",
DROP COLUMN "valueTotal",
ADD COLUMN     "accountFee" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "available" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "contribution" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "current" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "deposit" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "distribution" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "dividend" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "dividendReinvestment" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "fundFee" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "interest" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "interestReinvestment" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "lastUpdatedDatetime" TIMESTAMP(3),
ADD COLUMN     "loanPayment" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "longTermCapitalGain" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "managementFee" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "marginExpense" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "nonQualifiedDividend" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "nonResidentTax" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "qualifiedDividend" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "returnOfPrincipal" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "shortTermCapitalGain" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "stockDistribution" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "taxWithheld" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "unqualifiedGain" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "withdrawal" DECIMAL(14,4) NOT NULL DEFAULT 0,
ALTER COLUMN "unrealizedLoss" SET DATA TYPE DECIMAL(14,4),
ALTER COLUMN "unrealizedProfit" SET DATA TYPE DECIMAL(14,4);

-- AlterTable
ALTER TABLE "public"."Position" DROP CONSTRAINT "Position_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "Position_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."PositionSnapshotOnPortfolioBalanceSnapshot" (
    "positionSnapshotId" UUID NOT NULL,
    "portfolioBalanceSnapshotId" BIGINT NOT NULL,

    CONSTRAINT "PositionSnapshotOnPortfolioBalanceSnapshot_pkey" PRIMARY KEY ("positionSnapshotId","portfolioBalanceSnapshotId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lot_positionId_externalId_key" ON "public"."Lot"("positionId", "externalId");

-- AddForeignKey
ALTER TABLE "public"."Lot" ADD CONSTRAINT "Lot_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PositionSnapshotOnPortfolioBalanceSnapshot" ADD CONSTRAINT "PositionSnapshotOnPortfolioBalanceSnapshot_positionSnapsho_fkey" FOREIGN KEY ("positionSnapshotId") REFERENCES "public"."PositionSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PositionSnapshotOnPortfolioBalanceSnapshot" ADD CONSTRAINT "PositionSnapshotOnPortfolioBalanceSnapshot_portfolioBalanc_fkey" FOREIGN KEY ("portfolioBalanceSnapshotId") REFERENCES "public"."PortfolioBalanceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
