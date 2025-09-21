/*
  Warnings:

  - You are about to drop the column `accountId` on the `PositionSnapshot` table. All the data in the column will be lost.
  - Added the required column `authConnectionId` to the `PositionSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PositionSnapshot" DROP CONSTRAINT "PositionSnapshot_accountId_fkey";

-- DropIndex
DROP INDEX "public"."PositionSnapshot_accountId_createdAt_idx";

-- AlterTable
ALTER TABLE "public"."PositionSnapshot" DROP COLUMN "accountId",
ADD COLUMN     "authConnectionId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "PositionSnapshot_portfolioId_createdAt_idx" ON "public"."PositionSnapshot"("portfolioId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "public"."PositionSnapshot" ADD CONSTRAINT "PositionSnapshot_authConnectionId_fkey" FOREIGN KEY ("authConnectionId") REFERENCES "public"."AuthConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
