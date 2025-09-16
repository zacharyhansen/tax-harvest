/*
  Warnings:

  - You are about to drop the column `accountId` on the `MultiChangeSet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MultiChangeSet" DROP CONSTRAINT "MultiChangeSet_accountId_fkey";

-- DropIndex
DROP INDEX "public"."MultiChangeSet_portfolioId_accountId_idx";

-- AlterTable
ALTER TABLE "public"."MultiChangeSet" DROP COLUMN "accountId";

-- CreateIndex
CREATE INDEX "MultiChangeSet_portfolioId_idx" ON "public"."MultiChangeSet"("portfolioId");
