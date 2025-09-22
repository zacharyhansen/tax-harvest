/*
  Warnings:

  - You are about to drop the column `accountId` on the `PortfolioBalanceSnapshot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[positionSnapshotId,externalId]` on the table `Position` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."PortfolioBalanceSnapshot" DROP CONSTRAINT "PortfolioBalanceSnapshot_accountId_fkey";

-- AlterTable
ALTER TABLE "public"."PortfolioBalanceSnapshot" DROP COLUMN "accountId";

-- CreateIndex
CREATE UNIQUE INDEX "Position_positionSnapshotId_externalId_key" ON "public"."Position"("positionSnapshotId", "externalId");
