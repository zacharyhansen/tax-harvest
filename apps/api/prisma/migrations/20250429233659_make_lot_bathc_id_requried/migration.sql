/*
  Warnings:

  - Made the column `lotTransactionBatchId` on table `LotChangeLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LotChangeLog" DROP CONSTRAINT "LotChangeLog_lotTransactionBatchId_fkey";

-- DropIndex
DROP INDEX "LotTransactionBatch_portfolioId_idx";

-- AlterTable
ALTER TABLE "LotChangeLog" ALTER COLUMN "lotTransactionBatchId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "LotTransactionBatch_portfolioId_createdAt_idx" ON "LotTransactionBatch"("portfolioId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "LotChangeLog" ADD CONSTRAINT "LotChangeLog_lotTransactionBatchId_fkey" FOREIGN KEY ("lotTransactionBatchId") REFERENCES "LotTransactionBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
