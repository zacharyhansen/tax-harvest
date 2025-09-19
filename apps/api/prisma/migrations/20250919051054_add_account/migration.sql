/*
  Warnings:

  - The primary key for the `TransactionOnLotMerge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `accountId` to the `TransactionOnLotMerge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TransactionOnLotMerge" DROP CONSTRAINT "TransactionOnLotMerge_pkey",
ADD COLUMN     "accountId" UUID NOT NULL,
ADD CONSTRAINT "TransactionOnLotMerge_pkey" PRIMARY KEY ("lotMergeId", "transactionId");

-- AddForeignKey
ALTER TABLE "public"."TransactionOnLotMerge" ADD CONSTRAINT "TransactionOnLotMerge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
