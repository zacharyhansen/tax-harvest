-- AlterTable
ALTER TABLE "public"."LotTransactionBatch" ADD COLUMN     "realizedProfitAndLossLongTerm" DECIMAL(14,4),
ADD COLUMN     "realizedProfitAndLossShortTerm" DECIMAL(14,4);
