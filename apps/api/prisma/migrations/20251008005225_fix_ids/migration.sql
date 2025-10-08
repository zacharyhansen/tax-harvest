/*
  Warnings:

  - You are about to drop the column `pkPlaidInstitutionId` on the `AuthConnection` table. All the data in the column will be lost.
  - The primary key for the `PlaidInstitution` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `institutionId` on the `PlaidInstitution` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AuthConnection" DROP CONSTRAINT "AuthConnection_pkPlaidInstitutionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PortfolioConnect" DROP CONSTRAINT "PortfolioConnect_plaidInstitutionId_fkey";

-- DropIndex
DROP INDEX "public"."PlaidInstitution_institutionId_key";

-- AlterTable
ALTER TABLE "public"."AuthConnection" DROP COLUMN "pkPlaidInstitutionId";

-- AlterTable
ALTER TABLE "public"."PlaidInstitution" DROP CONSTRAINT "PlaidInstitution_pkey",
DROP COLUMN "institutionId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PlaidInstitution_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PortfolioConnect" ALTER COLUMN "plaidInstitutionId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "AuthConnection_portfolioId_plaidInstitutionId_idx" ON "public"."AuthConnection"("portfolioId", "plaidInstitutionId");

-- AddForeignKey
ALTER TABLE "public"."PortfolioConnect" ADD CONSTRAINT "PortfolioConnect_plaidInstitutionId_fkey" FOREIGN KEY ("plaidInstitutionId") REFERENCES "public"."PlaidInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthConnection" ADD CONSTRAINT "AuthConnection_plaidInstitutionId_fkey" FOREIGN KEY ("plaidInstitutionId") REFERENCES "public"."PlaidInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
