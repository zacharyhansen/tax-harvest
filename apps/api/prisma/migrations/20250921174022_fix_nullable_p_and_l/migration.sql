/*
  Warnings:

  - Made the column `profitAndLossType` on table `AccountRealizedPAndLHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" ALTER COLUMN "realizedPAndLId" DROP NOT NULL,
ALTER COLUMN "profitAndLossType" SET NOT NULL;
