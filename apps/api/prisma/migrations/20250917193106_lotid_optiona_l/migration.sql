-- DropForeignKey
ALTER TABLE "public"."MultiChangeSetOptionItem" DROP CONSTRAINT "MultiChangeSetOptionItem_lotId_fkey";

-- AlterTable
ALTER TABLE "public"."MultiChangeSetOptionItem" ALTER COLUMN "lotId" DROP NOT NULL;
