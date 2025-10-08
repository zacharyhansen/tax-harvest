-- CreateEnum
CREATE TYPE "public"."PorfolioConnectState" AS ENUM ('PENDING', 'COMPLETED', 'ERROR');

-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "portfolioConnectId" UUID;

-- CreateTable
CREATE TABLE "public"."PorfolioConnect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "portfolioId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "persistedSnapshot" JSONB NOT NULL DEFAULT '{}',
    "authConnectionId" UUID,
    "plaidInstitutionId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "public"."PorfolioConnectState" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PorfolioConnect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PorfolioConnect_portfolioId_state_idx" ON "public"."PorfolioConnect"("portfolioId", "state");

-- CreateIndex
CREATE UNIQUE INDEX "PorfolioConnect_portfolioId_plaidInstitutionId_key" ON "public"."PorfolioConnect"("portfolioId", "plaidInstitutionId");

-- AddForeignKey
ALTER TABLE "public"."PorfolioConnect" ADD CONSTRAINT "PorfolioConnect_authConnectionId_fkey" FOREIGN KEY ("authConnectionId") REFERENCES "public"."AuthConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PorfolioConnect" ADD CONSTRAINT "PorfolioConnect_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_portfolioConnectId_fkey" FOREIGN KEY ("portfolioConnectId") REFERENCES "public"."PorfolioConnect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
