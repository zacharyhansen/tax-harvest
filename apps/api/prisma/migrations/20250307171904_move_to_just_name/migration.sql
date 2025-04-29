/*
  Warnings:

  - You are about to drop the column `plaidAccountName` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "plaidAccountName",
ADD COLUMN     "name" TEXT;
