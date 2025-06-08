-- AlterTable
ALTER TABLE "LotTransactionBatch" ADD COLUMN     "holdingsPayload" JSONB,
ADD COLUMN     "positionsAfter" JSONB,
ADD COLUMN     "positionsBefore" JSONB,
ADD COLUMN     "transactionsPayload" JSONB;
