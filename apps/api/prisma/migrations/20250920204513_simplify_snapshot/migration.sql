-- DropIndex
DROP INDEX "public"."RealizedPAndL_accountId_year_key";

-- AlterTable
ALTER TABLE "public"."RealizedPAndL" ADD COLUMN     "available" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "current" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "isSnapshot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUpdatedDatetime" TIMESTAMP(3),
ADD COLUMN     "snapshotDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "RealizedPAndL_portfolioId_accountId_year_isSnapshot_snapsho_idx" ON "public"."RealizedPAndL"("portfolioId", "accountId", "year", "isSnapshot", "snapshotDate");
