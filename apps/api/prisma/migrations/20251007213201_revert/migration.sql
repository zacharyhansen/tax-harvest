/*
  Warnings:

  - Made the column `plaidInstitutionId` on table `PortfolioConnect` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."PortfolioConnect" ALTER COLUMN "plaidInstitutionId" SET NOT NULL;
