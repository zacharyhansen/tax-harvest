/*
  Warnings:

  - Added the required column `harvestId` to the `HarvestTransactionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HarvestTransactionItem" ADD COLUMN     "harvestId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "HarvestTransactionItem" ADD CONSTRAINT "HarvestTransactionItem_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
