/*
  Warnings:

  - You are about to drop the column `accountId` on the `MultiChangeSetOption` table. All the data in the column will be lost.
  - You are about to drop the column `acquiredDate` on the `MultiChangeSetOption` table. All the data in the column will be lost.
  - You are about to drop the column `isNewBuy` on the `MultiChangeSetOption` table. All the data in the column will be lost.
  - You are about to drop the column `lotId` on the `MultiChangeSetOption` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `MultiChangeSetOption` table. All the data in the column will be lost.
  - You are about to drop the column `quantityChange` on the `MultiChangeSetOption` table. All the data in the column will be lost.
  - You are about to drop the column `quantityFinal` on the `MultiChangeSetOption` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_lotId_fkey";

-- DropIndex
DROP INDEX "public"."MultiChangeSetOption_portfolioId_accountId_multiChangeSetId_idx";

-- AlterTable
ALTER TABLE "public"."MultiChangeSetOption" DROP COLUMN "accountId",
DROP COLUMN "acquiredDate",
DROP COLUMN "isNewBuy",
DROP COLUMN "lotId",
DROP COLUMN "price",
DROP COLUMN "quantityChange",
DROP COLUMN "quantityFinal";

-- CreateTable
CREATE TABLE "public"."MultiChangeSetOptionItem" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "lotId" UUID NOT NULL,
    "multiChangeSetOptionId" BIGINT NOT NULL,
    "acquiredDate" TIMESTAMP(3) NOT NULL,
    "quantityFinal" DECIMAL(14,4),
    "quantityChange" DECIMAL(14,4),
    "isNewBuy" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(14,4),

    CONSTRAINT "MultiChangeSetOptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MultiChangeSetOptionItem_portfolioId_accountId_multiChangeS_idx" ON "public"."MultiChangeSetOptionItem"("portfolioId", "accountId", "multiChangeSetOptionId");

-- CreateIndex
CREATE INDEX "MultiChangeSetOption_portfolioId_multiChangeSetId_idx" ON "public"."MultiChangeSetOption"("portfolioId", "multiChangeSetId");

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" ADD CONSTRAINT "MultiChangeSetOptionItem_multiChangeSetOptionId_fkey" FOREIGN KEY ("multiChangeSetOptionId") REFERENCES "public"."MultiChangeSetOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" ADD CONSTRAINT "MultiChangeSetOptionItem_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" ADD CONSTRAINT "MultiChangeSetOptionItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" ADD CONSTRAINT "MultiChangeSetOptionItem_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "public"."Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
