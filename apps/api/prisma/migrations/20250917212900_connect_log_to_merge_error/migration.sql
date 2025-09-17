/*
  Warnings:

  - A unique constraint covering the columns `[mergeErrorId]` on the table `Log` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Log" ADD COLUMN     "mergeErrorId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Log_mergeErrorId_key" ON "public"."Log"("mergeErrorId");

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_mergeErrorId_fkey" FOREIGN KEY ("mergeErrorId") REFERENCES "public"."MergeError"("id") ON DELETE SET NULL ON UPDATE CASCADE;
