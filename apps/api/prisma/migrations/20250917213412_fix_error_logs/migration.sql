/*
  Warnings:

  - You are about to drop the column `mergeErrorId` on the `Log` table. All the data in the column will be lost.
  - Added the required column `logId` to the `MergeError` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_mergeErrorId_fkey";

-- DropIndex
DROP INDEX "public"."Log_mergeErrorId_key";

-- AlterTable
ALTER TABLE "public"."Log" DROP COLUMN "mergeErrorId";

-- AlterTable
ALTER TABLE "public"."MergeError" ADD COLUMN     "logId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."MergeError" ADD CONSTRAINT "MergeError_logId_fkey" FOREIGN KEY ("logId") REFERENCES "public"."Log"("id") ON DELETE CASCADE ON UPDATE CASCADE;
