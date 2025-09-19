/*
  Warnings:

  - You are about to drop the `MultiChangeSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MergeErrorType" AS ENUM ('PLAID_MULTI_LOT_SOLUTION', 'PLAID_NO_SOLUTION');

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSet" DROP CONSTRAINT "MultiChangeSet_assetSymbol_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSet" DROP CONSTRAINT "MultiChangeSet_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_multiChangeSetId_fkey";

-- DropTable
DROP TABLE "public"."MultiChangeSet";

-- CreateTable
CREATE TABLE "public"."MergeError" (
    "id" BIGSERIAL NOT NULL,
    "type" "public"."MergeErrorType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "targetValue" DECIMAL(14,4),
    "targetQuantity" DECIMAL(14,4),
    "lotsData" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MergeError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MergeError_portfolioId_idx" ON "public"."MergeError"("portfolioId");

-- AddForeignKey
ALTER TABLE "public"."MergeError" ADD CONSTRAINT "MergeError_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MergeError" ADD CONSTRAINT "MergeError_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "public"."Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOption" ADD CONSTRAINT "MultiChangeSetOption_multiChangeSetId_fkey" FOREIGN KEY ("multiChangeSetId") REFERENCES "public"."MergeError"("id") ON DELETE CASCADE ON UPDATE CASCADE;
