-- AlterTable
ALTER TABLE "LotTransactionBatch" ADD COLUMN     "deletedLots" JSONB,
ADD COLUMN     "realizedProfitAndLoss" DECIMAL(14,4);
