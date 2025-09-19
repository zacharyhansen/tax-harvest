-- CreateTable
CREATE TABLE "public"."PortfolioBalanceSnapshot" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "valueTotal" DOUBLE PRECISION NOT NULL,
    "valueCash" DOUBLE PRECISION NOT NULL,
    "valueAssets" DOUBLE PRECISION NOT NULL,
    "positions" JSONB NOT NULL,

    CONSTRAINT "PortfolioBalanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioBalanceSnapshot_portfolioId_createdAt_idx" ON "public"."PortfolioBalanceSnapshot"("portfolioId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."PortfolioBalanceSnapshot" ADD CONSTRAINT "PortfolioBalanceSnapshot_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PortfolioBalanceSnapshot" ADD CONSTRAINT "PortfolioBalanceSnapshot_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
