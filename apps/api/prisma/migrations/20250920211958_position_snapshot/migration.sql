/*
  Warnings:

  - Added the required column `positionSnapshotId` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Position_accountId_createdAt_idx";

-- AlterTable
ALTER TABLE "public"."Position" ADD COLUMN     "positionSnapshotId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."PositionSnapshot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,

    CONSTRAINT "PositionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PositionSnapshot_accountId_createdAt_idx" ON "public"."PositionSnapshot"("accountId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Position_positionSnapshotId_idx" ON "public"."Position"("positionSnapshotId");

-- AddForeignKey
ALTER TABLE "public"."PositionSnapshot" ADD CONSTRAINT "PositionSnapshot_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PositionSnapshot" ADD CONSTRAINT "PositionSnapshot_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Position" ADD CONSTRAINT "Position_positionSnapshotId_fkey" FOREIGN KEY ("positionSnapshotId") REFERENCES "public"."PositionSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
