/*
  Warnings:

  - You are about to drop the column `positionId` on the `RealizedPAndL` table. All the data in the column will be lost.
  - Added the required column `positionSnapshotId` to the `RealizedPAndL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."RealizedPAndL" DROP CONSTRAINT "RealizedPAndL_positionId_fkey";

-- AlterTable
ALTER TABLE "public"."RealizedPAndL" DROP COLUMN "positionId",
ADD COLUMN     "positionSnapshotId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RealizedPAndL" ADD CONSTRAINT "RealizedPAndL_positionSnapshotId_fkey" FOREIGN KEY ("positionSnapshotId") REFERENCES "public"."PositionSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
