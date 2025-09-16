-- CreateTable
CREATE TABLE "public"."MultiChangeSet" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "targetValue" DECIMAL(14,4),
    "targetQuantity" DECIMAL(14,4),
    "lotsData" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MultiChangeSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MultiChangeSetOption" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "lotId" UUID NOT NULL,
    "multiChangeSetId" BIGINT NOT NULL,
    "acquiredDate" TIMESTAMP(3) NOT NULL,
    "quantityFinal" DECIMAL(14,4),
    "quantityChange" DECIMAL(14,4),
    "isNewBuy" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(14,4),

    CONSTRAINT "MultiChangeSetOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MultiChangeSet_portfolioId_accountId_idx" ON "public"."MultiChangeSet"("portfolioId", "accountId");

-- CreateIndex
CREATE INDEX "MultiChangeSetOption_portfolioId_accountId_multiChangeSetId_idx" ON "public"."MultiChangeSetOption"("portfolioId", "accountId", "multiChangeSetId");

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSet" ADD CONSTRAINT "MultiChangeSet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSet" ADD CONSTRAINT "MultiChangeSet_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSet" ADD CONSTRAINT "MultiChangeSet_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "public"."Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOption" ADD CONSTRAINT "MultiChangeSetOption_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOption" ADD CONSTRAINT "MultiChangeSetOption_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOption" ADD CONSTRAINT "MultiChangeSetOption_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "public"."Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
