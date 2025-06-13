/*
  Warnings:

  - You are about to drop the column `notify` on the `HarvestTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `revertDate` on the `HarvestTransaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Harvest_portfolioId_idx";

-- AlterTable
ALTER TABLE "Harvest" ADD COLUMN     "afterWashRevertDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notify" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "HarvestTransaction" DROP COLUMN "notify",
DROP COLUMN "revertDate";

-- CreateIndex
CREATE INDEX "Harvest_portfolioId_afterWashRevertDate_idx" ON "Harvest"("portfolioId", "afterWashRevertDate");

-- CreateIndex
CREATE INDEX "HarvestTransaction_portfolioId_idx" ON "HarvestTransaction"("portfolioId");

-- CreateIndex
CREATE INDEX "HarvestTransaction_harvestId_idx" ON "HarvestTransaction"("harvestId");
