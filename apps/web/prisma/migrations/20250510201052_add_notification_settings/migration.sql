-- CreateEnum
CREATE TYPE "HarvestNotificationFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'NEVER');

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "notificationFrequency" "HarvestNotificationFrequency" NOT NULL DEFAULT 'WEEKLY';
