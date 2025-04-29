/*
  Warnings:

  - You are about to drop the column `transactionsPayload` on the `LotTransactionBatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LotTransactionBatch" DROP COLUMN "transactionsPayload";
