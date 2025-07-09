-- AlterTable
ALTER TABLE "Harvest" ADD COLUMN     "recommendationExpiresDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
