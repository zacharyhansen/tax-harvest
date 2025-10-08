/*
  Warnings:

  - You are about to drop the column `institution` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "institution";

-- DropEnum
DROP TYPE "public"."AccountInstitution";
