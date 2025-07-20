-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "HarvestType" ADD VALUE 'NO_OPPORTUNITY_GAINS';
ALTER TYPE "HarvestType" ADD VALUE 'NO_OPPORTUNITY_LOSSES';
ALTER TYPE "HarvestType" ADD VALUE 'NO_OPPORTUNITY_EMPTY';
