-- CreateEnum
CREATE TYPE "public"."ProfitAndLossType" AS ENUM ('DIVIDEND', 'INTEREST', 'SHORT_TERM', 'LONG_TERM', 'DEFERRED');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "profitAndLossType" "public"."ProfitAndLossType";
