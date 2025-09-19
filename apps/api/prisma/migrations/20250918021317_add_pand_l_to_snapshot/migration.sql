-- AlterTable
ALTER TABLE "public"."PortfolioBalanceSnapshot" ADD COLUMN     "realizedPAndL" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "unrealizedPAndL" DOUBLE PRECISION NOT NULL DEFAULT 0;
