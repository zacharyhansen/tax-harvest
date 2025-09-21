/*
  Warnings:

  - You are about to drop the column `appliedToLots` on the `LotUpload` table. All the data in the column will be lost.
  - You are about to drop the column `appliedToLots` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AccountRealizedPAndLHistory" ADD COLUMN     "applied" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."LotUpload" DROP COLUMN "appliedToLots",
ADD COLUMN     "applied" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "appliedToLots",
ADD COLUMN     "merged" BOOLEAN NOT NULL DEFAULT false;
