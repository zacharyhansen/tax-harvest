-- AlterTable
ALTER TABLE "AuthConnection" ADD COLUMN     "lastTransactionSyncedAtPlaid" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Account_portfolioId_idx" ON "Account"("portfolioId");

-- CreateIndex
CREATE INDEX "AuthConnection_portfolioId_idx" ON "AuthConnection"("portfolioId");

-- CreateIndex
CREATE INDEX "Harvest_portfolioId_idx" ON "Harvest"("portfolioId");

-- CreateIndex
CREATE INDEX "HarvestTransactionItem_lotId_idx" ON "HarvestTransactionItem"("lotId");

-- CreateIndex
CREATE INDEX "Lot_accountId_idx" ON "Lot"("accountId");

-- CreateIndex
CREATE INDEX "Position_accountId_idx" ON "Position"("accountId");
