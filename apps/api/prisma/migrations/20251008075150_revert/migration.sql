/*
  Warnings:

  - Added the required column `fileId` to the `LotUpload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LotUpload" ADD COLUMN     "fileId" UUID NOT NULL;
