/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `isSnapshot` on the `RealizedPAndL` table. All the data in the column will be lost.
  - You are about to drop the column `snapshotDate` on the `RealizedPAndL` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `RealizedPAndL` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `RealizedPAndL` table. All the data in the column will be lost.
  - Added the required column `positionId` to the `RealizedPAndL` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Position_accountId_externalId_key";

-- DropIndex
DROP INDEX "public"."Position_accountId_idx";

-- DropIndex
DROP INDEX "public"."RealizedPAndL_portfolioId_accountId_year_isSnapshot_snapsho_idx";

-- AlterTable
ALTER TABLE "public"."Position" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."RealizedPAndL" DROP COLUMN "isSnapshot",
DROP COLUMN "snapshotDate",
DROP COLUMN "updatedAt",
DROP COLUMN "year",
ADD COLUMN     "positionId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Position_accountId_createdAt_idx" ON "public"."Position"("accountId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "RealizedPAndL_accountId_createdAt_idx" ON "public"."RealizedPAndL"("accountId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "public"."RealizedPAndL" ADD CONSTRAINT "RealizedPAndL_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;
