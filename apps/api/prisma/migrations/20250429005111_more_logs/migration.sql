-- AlterTable
ALTER TABLE "LotTransactionBatch" ADD COLUMN     "initialLots" JSONB,
ADD COLUMN     "lotTupleMap" JSONB,
ADD COLUMN     "newBuys" JSONB,
ADD COLUMN     "newSells" JSONB,
ADD COLUMN     "newTransactions" JSONB;
