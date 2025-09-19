/*
  Warnings:

  - You are about to drop the `MultiChangeSetOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MultiChangeSetOptionItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aquiredDate` to the `LotChange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `LotChange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_multiChangeSetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOption" DROP CONSTRAINT "MultiChangeSetOption_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" DROP CONSTRAINT "MultiChangeSetOptionItem_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" DROP CONSTRAINT "MultiChangeSetOptionItem_multiChangeSetOptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" DROP CONSTRAINT "MultiChangeSetOptionItem_portfolioId_fkey";

-- AlterTable
ALTER TABLE "public"."LotChange" ADD COLUMN     "aquiredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price" DECIMAL(14,4) NOT NULL;

-- DropTable
DROP TABLE "public"."MultiChangeSetOption";

-- DropTable
DROP TABLE "public"."MultiChangeSetOptionItem";
