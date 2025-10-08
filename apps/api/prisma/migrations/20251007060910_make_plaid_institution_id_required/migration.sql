/*
  Warnings:

  - Made the column `plaidInstitutionId` on table `AuthConnection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AuthConnection" ALTER COLUMN "plaidInstitutionId" SET NOT NULL;
