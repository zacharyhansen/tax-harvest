/*
  Warnings:

  - A unique constraint covering the columns `[portfolioConnectId]` on the table `AuthConnection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `portfolioConnectId` to the `AuthConnection` table without a default value. This is not possible if the table is not empty.
  - Made the column `pkPlaidInstitutionId` on table `AuthConnection` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."PortfolioConnect" DROP CONSTRAINT "PortfolioConnect_authConnectionId_fkey";

-- AlterTable
ALTER TABLE "public"."AuthConnection" ADD COLUMN     "portfolioConnectId" UUID NOT NULL,
ALTER COLUMN "pkPlaidInstitutionId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthConnection_portfolioConnectId_key" ON "public"."AuthConnection"("portfolioConnectId");

-- AddForeignKey
ALTER TABLE "public"."AuthConnection" ADD CONSTRAINT "AuthConnection_portfolioConnectId_fkey" FOREIGN KEY ("portfolioConnectId") REFERENCES "public"."PortfolioConnect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
