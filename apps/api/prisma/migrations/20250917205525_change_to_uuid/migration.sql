/*
  Warnings:

  - The primary key for the `MergeError` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MergeError` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MultiChangeSetOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MultiChangeSetOption` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MultiChangeSetOptionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MultiChangeSetOptionItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `multiChangeSetId` on the `MultiChangeSetOption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `multiChangeSetOptionId` on the `MultiChangeSetOptionItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_multiChangeSetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" DROP CONSTRAINT "MultiChangeSetOptionItem_multiChangeSetOptionId_fkey";

-- DropIndex
DROP INDEX "public"."MergeError_portfolioId_idx";

-- DropIndex
DROP INDEX "public"."MultiChangeSetOption_portfolioId_multiChangeSetId_idx";

-- AlterTable
ALTER TABLE "public"."MergeError" DROP CONSTRAINT "MergeError_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "MergeError_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "multiChangeSetId",
ADD COLUMN     "multiChangeSetId" UUID NOT NULL,
ADD CONSTRAINT "MultiChangeSetOption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."MultiChangeSetOptionItem" DROP CONSTRAINT "MultiChangeSetOptionItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "multiChangeSetOptionId",
ADD COLUMN     "multiChangeSetOptionId" UUID NOT NULL,
ADD CONSTRAINT "MultiChangeSetOptionItem_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "MergeError_createdAt_idx" ON "public"."MergeError"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "MultiChangeSetOption_multiChangeSetId_idx" ON "public"."MultiChangeSetOption"("multiChangeSetId");

-- CreateIndex
CREATE INDEX "MultiChangeSetOptionItem_portfolioId_accountId_multiChangeS_idx" ON "public"."MultiChangeSetOptionItem"("portfolioId", "accountId", "multiChangeSetOptionId");

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOption" ADD CONSTRAINT "MultiChangeSetOption_multiChangeSetId_fkey" FOREIGN KEY ("multiChangeSetId") REFERENCES "public"."MergeError"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" ADD CONSTRAINT "MultiChangeSetOptionItem_multiChangeSetOptionId_fkey" FOREIGN KEY ("multiChangeSetOptionId") REFERENCES "public"."MultiChangeSetOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
