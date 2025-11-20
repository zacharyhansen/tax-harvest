/*
  Warnings:

  - You are about to drop the column `accountId` on the `LotModel` table. All the data in the column will be lost.
  - You are about to alter the column `vector` on the `PriceHourlyVector` table. The data in that column could be lost. The data in that column will be cast from `vector(1060)` to `Unsupported("vector(1060)")`.

*/
-- DropForeignKey
ALTER TABLE "public"."LotModel" DROP CONSTRAINT "LotModel_accountId_fkey";

-- AlterTable
ALTER TABLE "LotModel" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "PriceHourlyVector" ALTER COLUMN "vector" SET DATA TYPE vector(1060);
