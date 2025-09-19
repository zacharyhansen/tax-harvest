/*
  Warnings:

  - You are about to drop the column `operationType` on the `ResolvedLotMerge` table. All the data in the column will be lost.
  - Added the required column `operationType` to the `LotChange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."OperationType" ADD VALUE 'upsert';

-- AlterTable
ALTER TABLE "public"."LotChange" ADD COLUMN     "operationType" "public"."OperationType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."ResolvedLotMerge" DROP COLUMN "operationType";
