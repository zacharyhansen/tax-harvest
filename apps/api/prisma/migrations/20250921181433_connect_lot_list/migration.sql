/*
  Warnings:

  - You are about to drop the column `lotId` on the `AccountRealizedPAndLHistory` table. All the data in the column will be lost.
  - You are about to drop the column `targetPositionSnapshot` on the `AssetMerge` table. All the data in the column will be lost.
  - Added the required column `positionSnapshotId` to the `AssetMerge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP CONSTRAINT "AccountRealizedPAndLHistory_lotId_fkey";

-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" DROP COLUMN "lotId",
ADD COLUMN     "lotChangeListId" UUID;

-- AlterTable
ALTER TABLE "public"."AssetMerge" DROP COLUMN "targetPositionSnapshot",
ADD COLUMN     "positionSnapshotId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD CONSTRAINT "AccountRealizedPAndLHistory_lotChangeListId_fkey" FOREIGN KEY ("lotChangeListId") REFERENCES "public"."LotChangeList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetMerge" ADD CONSTRAINT "AssetMerge_positionSnapshotId_fkey" FOREIGN KEY ("positionSnapshotId") REFERENCES "public"."PositionSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
