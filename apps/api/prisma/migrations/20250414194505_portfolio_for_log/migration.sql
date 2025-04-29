/*
  Warnings:

  - Added the required column `portfolioId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "LogType" ADD VALUE 'PLAID_WEBHOOK';

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Log_portfolioId_type_idx" ON "Log"("portfolioId", "type");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
