/*
  Warnings:

  - Made the column `acquiredDate` on table `Lot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lot" ALTER COLUMN "acquiredDate" SET NOT NULL;
