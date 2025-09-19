/*
  Warnings:

  - You are about to drop the column `realizedPAndL` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `unrealizedPAndL` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PortfolioBalanceSnapshot" DROP COLUMN "realizedPAndL",
DROP COLUMN "unrealizedPAndL",
ADD COLUMN     "realizedPAndLLongTerm" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "realizedPAndLShortTerm" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "unrealizedLoss" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "unrealizedProfit" DOUBLE PRECISION NOT NULL DEFAULT 0;
