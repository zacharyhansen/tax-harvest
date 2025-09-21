/*
  Warnings:

  - You are about to drop the column `deferredLossChange` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - You are about to drop the column `dividendChange` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - You are about to drop the column `longTermChange` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - You are about to drop the column `shortTermChange` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - Added the required column `profitAndLossType` to the `AccountRealizedPAndLHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP COLUMN "deferredLossChange",
DROP COLUMN "dividendChange",
DROP COLUMN "longTermChange",
DROP COLUMN "shortTermChange",
ADD COLUMN     "profitAndLossType" "public"."ProfitAndLossType" NOT NULL,
ADD COLUMN     "value" DECIMAL(14,4) NOT NULL DEFAULT 0;
