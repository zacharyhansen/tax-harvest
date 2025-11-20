/*
  Warnings:

  - You are about to alter the column `vector` on the `PriceHourlyVector` table. The data in that column could be lost. The data in that column will be cast from `vector(1060)` to `Unsupported("vector(1060)")`.

*/
-- AlterTable
ALTER TABLE "PriceHourlyVector" ALTER COLUMN "vector" SET DATA TYPE vector(1060);

-- CreateTable
CREATE TABLE "LotModel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,

    CONSTRAINT "LotModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotOnLotModel" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lotModelId" UUID NOT NULL,
    "lotId" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "LotOnLotModel_pkey" PRIMARY KEY ("lotModelId","lotId")
);

-- CreateIndex
CREATE INDEX "LotModel_portfolioId_createdAt_idx" ON "LotModel"("portfolioId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "LotModel" ADD CONSTRAINT "LotModel_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotModel" ADD CONSTRAINT "LotModel_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotOnLotModel" ADD CONSTRAINT "LotOnLotModel_lotModelId_fkey" FOREIGN KEY ("lotModelId") REFERENCES "LotModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotOnLotModel" ADD CONSTRAINT "LotOnLotModel_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
