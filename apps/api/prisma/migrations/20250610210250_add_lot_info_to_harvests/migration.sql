/*
  Warnings:

  - Added the required column `lotAcquiredDate` to the `HarvestTransactionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotPriceAtHarvest` to the `HarvestTransactionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotPricePaid` to the `HarvestTransactionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HarvestTransactionItem" ADD COLUMN     "lotAcquiredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lotPriceAtHarvest" DECIMAL(14,4) NOT NULL,
ADD COLUMN     "lotPricePaid" DECIMAL(14,4) NOT NULL;
