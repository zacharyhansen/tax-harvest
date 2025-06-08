/*
  Warnings:

  - Made the column `price` on table `Lot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remainingQty` on table `Lot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lot" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "remainingQty" SET NOT NULL;
