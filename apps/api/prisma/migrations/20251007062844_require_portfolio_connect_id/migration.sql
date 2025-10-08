/*
  Warnings:

  - Made the column `portfolioConnectId` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Account" ALTER COLUMN "portfolioConnectId" SET NOT NULL;
