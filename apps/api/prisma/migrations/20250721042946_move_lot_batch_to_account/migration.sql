/*
  Warnings:

  - You are about to drop the column `authConnectionId` on the `LotTransactionBatch` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `LotTransactionBatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LotTransactionBatch" DROP CONSTRAINT "LotTransactionBatch_authConnectionId_fkey";

-- AlterTable
ALTER TABLE "LotTransactionBatch" DROP COLUMN "authConnectionId",
ADD COLUMN     "accountId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "LotTransactionBatch" ADD CONSTRAINT "LotTransactionBatch_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
