/*
  Warnings:

  - You are about to drop the `PorfolioConnect` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_portfolioConnectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PorfolioConnect" DROP CONSTRAINT "PorfolioConnect_authConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PorfolioConnect" DROP CONSTRAINT "PorfolioConnect_plaidInstitutionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PorfolioConnect" DROP CONSTRAINT "PorfolioConnect_portfolioId_fkey";

-- DropTable
DROP TABLE "public"."PorfolioConnect";

-- CreateTable
CREATE TABLE "public"."PortfolioConnect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "portfolioId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "persistedSnapshot" JSONB NOT NULL DEFAULT '{}',
    "authConnectionId" UUID,
    "plaidInstitutionId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "public"."PorfolioConnectState" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PortfolioConnect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioConnect_portfolioId_state_idx" ON "public"."PortfolioConnect"("portfolioId", "state");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioConnect_portfolioId_plaidInstitutionId_key" ON "public"."PortfolioConnect"("portfolioId", "plaidInstitutionId");

-- AddForeignKey
ALTER TABLE "public"."PortfolioConnect" ADD CONSTRAINT "PortfolioConnect_authConnectionId_fkey" FOREIGN KEY ("authConnectionId") REFERENCES "public"."AuthConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PortfolioConnect" ADD CONSTRAINT "PortfolioConnect_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PortfolioConnect" ADD CONSTRAINT "PortfolioConnect_plaidInstitutionId_fkey" FOREIGN KEY ("plaidInstitutionId") REFERENCES "public"."PlaidInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_portfolioConnectId_fkey" FOREIGN KEY ("portfolioConnectId") REFERENCES "public"."PortfolioConnect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
