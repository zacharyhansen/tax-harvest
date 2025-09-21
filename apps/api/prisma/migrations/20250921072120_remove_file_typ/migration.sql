/*
  Warnings:

  - You are about to drop the column `fileType` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "fileType";

-- DropEnum
DROP TYPE "public"."FileType";
