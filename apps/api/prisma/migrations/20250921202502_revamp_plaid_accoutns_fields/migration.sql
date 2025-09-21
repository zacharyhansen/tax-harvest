-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "available" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "current" DECIMAL(14,4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."RealizedPAndL" ADD COLUMN     "unrealizedLoss" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "unrealizedProfit" DECIMAL(14,4) NOT NULL DEFAULT 0;
