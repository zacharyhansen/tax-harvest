/*
  Warnings:

  - Added the required column `resolvedLotChange` to the `LotMerge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `MergeError` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolveLotsInput` to the `PlaidMerge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LotMerge" ADD COLUMN     "resolvedLotChange" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."MergeError" ADD COLUMN     "accountId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."PlaidMerge" ADD COLUMN     "resolveLotsInput" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."MergeError" ADD CONSTRAINT "MergeError_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
