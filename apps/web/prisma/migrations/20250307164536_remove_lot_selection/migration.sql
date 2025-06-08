/*
  Warnings:

  - The values [LOT_SELECTION] on the enum `HarvestStep` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HarvestStep_new" AS ENUM ('CONFIGURE', 'REVIEW', 'COMPLETE');
ALTER TABLE "Harvest" ALTER COLUMN "step" DROP DEFAULT;
ALTER TABLE "Harvest" ALTER COLUMN "step" TYPE "HarvestStep_new" USING ("step"::text::"HarvestStep_new");
ALTER TYPE "HarvestStep" RENAME TO "HarvestStep_old";
ALTER TYPE "HarvestStep_new" RENAME TO "HarvestStep";
DROP TYPE "HarvestStep_old";
ALTER TABLE "Harvest" ALTER COLUMN "step" SET DEFAULT 'CONFIGURE';
COMMIT;
