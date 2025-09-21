/*
  Warnings:

  - You are about to drop the column `applied` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP COLUMN "applied",
ALTER COLUMN "profitAndLossType" DROP NOT NULL;
