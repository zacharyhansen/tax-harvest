/*
  Warnings:

  - You are about to drop the column `payloadAfter` on the `LotChangeLog` table. All the data in the column will be lost.
  - You are about to drop the column `payloadBefore` on the `LotChangeLog` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "LogType" ADD VALUE 'PLAID_TRX_MERGE';

-- AlterTable
ALTER TABLE "LotChangeLog" DROP COLUMN "payloadAfter",
DROP COLUMN "payloadBefore",
ADD COLUMN     "lotAfter" JSONB,
ADD COLUMN     "lotBefore" JSONB;

-- CreateIndex
CREATE INDEX "Account_authConnectionId_idx" ON "Account"("authConnectionId");
