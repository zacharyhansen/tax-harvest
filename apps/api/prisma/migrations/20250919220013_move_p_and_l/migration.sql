/*
  Warnings:

  - You are about to drop the column `realizedProfitAndLossLongTerm` on the `AssetMerge` table. All the data in the column will be lost.
  - You are about to drop the column `realizedProfitAndLossShortTerm` on the `AssetMerge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AssetMerge" DROP COLUMN "realizedProfitAndLossLongTerm",
DROP COLUMN "realizedProfitAndLossShortTerm";

-- AlterTable
ALTER TABLE "public"."LotChange" ADD COLUMN     "realizedProfitAndLossLongTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "realizedProfitAndLossShortTerm" DECIMAL(14,4) NOT NULL DEFAULT 0;
