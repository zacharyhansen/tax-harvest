-- AlterTable
ALTER TABLE "LotChangeLog" ADD COLUMN     "lotTransactionBatchId" UUID,
ADD COLUMN     "transactionId" UUID;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "appliedToLots" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "LotTransactionBatch" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "authConnectionId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,

    CONSTRAINT "LotTransactionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LotTransactionBatch_portfolioId_idx" ON "LotTransactionBatch"("portfolioId");

-- CreateIndex
CREATE INDEX "LotChangeLog_portfolioId_lotTransactionBatchId_idx" ON "LotChangeLog"("portfolioId", "lotTransactionBatchId");

-- CreateIndex
CREATE INDEX "LotChangeLog_portfolioId_transactionId_idx" ON "LotChangeLog"("portfolioId", "transactionId");

-- AddForeignKey
ALTER TABLE "LotTransactionBatch" ADD CONSTRAINT "LotTransactionBatch_authConnectionId_fkey" FOREIGN KEY ("authConnectionId") REFERENCES "AuthConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotTransactionBatch" ADD CONSTRAINT "LotTransactionBatch_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotChangeLog" ADD CONSTRAINT "LotChangeLog_lotTransactionBatchId_fkey" FOREIGN KEY ("lotTransactionBatchId") REFERENCES "LotTransactionBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotChangeLog" ADD CONSTRAINT "LotChangeLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
