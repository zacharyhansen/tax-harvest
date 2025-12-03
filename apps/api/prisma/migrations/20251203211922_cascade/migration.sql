/*
  Warnings:

  - You are about to alter the column `vector` on the `PriceHourlyVector` table. The data in that column could be lost. The data in that column will be cast from `vector(1060)` to `Unsupported("vector(1060)")`.

*/
-- DropForeignKey
ALTER TABLE "public"."Portfolio" DROP CONSTRAINT "Portfolio_createdById_fkey";

-- AlterTable
ALTER TABLE "PriceHourlyVector" ALTER COLUMN "vector" SET DATA TYPE vector(1060);

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
