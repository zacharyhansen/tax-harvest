/*
  Warnings:

  - Added the required column `portfolioId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `HarvestTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `HarvestTransactionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `RealizedPAndL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/

-- First add the enum value and commit it
ALTER TYPE "AccountProvider" ADD VALUE 'UNCONNECTED';
COMMIT;

-- First add the columns as nullable
ALTER TABLE "File" ADD COLUMN "portfolioId" UUID;
ALTER TABLE "HarvestTransaction" ADD COLUMN "portfolioId" UUID;
ALTER TABLE "HarvestTransactionItem" ADD COLUMN "portfolioId" UUID;
ALTER TABLE "Lot" ADD COLUMN "portfolioId" UUID;
ALTER TABLE "Position" ADD COLUMN "portfolioId" UUID;
ALTER TABLE "RealizedPAndL" ADD COLUMN "portfolioId" UUID;
ALTER TABLE "Transaction" ADD COLUMN "portfolioId" UUID;

-- Populate portfolioId from Account relationship
UPDATE "File" f
SET "portfolioId" = a."portfolioId"
FROM "Account" a
WHERE f."accountId" = a.id;

UPDATE "Lot" l
SET "portfolioId" = a."portfolioId"
FROM "Account" a
WHERE l."accountId" = a.id;

UPDATE "Position" p
SET "portfolioId" = a."portfolioId"
FROM "Account" a
WHERE p."accountId" = a.id;

UPDATE "RealizedPAndL" r
SET "portfolioId" = a."portfolioId"
FROM "Account" a
WHERE r."accountId" = a.id;

UPDATE "Transaction" t
SET "portfolioId" = a."portfolioId"
FROM "Account" a
WHERE t."accountId" = a.id;

-- For HarvestTransaction and HarvestTransactionItem, we need to get portfolioId from Harvest
UPDATE "HarvestTransaction" ht
SET "portfolioId" = h."portfolioId"
FROM "Harvest" h
WHERE ht."harvestId" = h.id;

UPDATE "HarvestTransactionItem" hti
SET "portfolioId" = ht."portfolioId"
FROM "HarvestTransaction" ht
WHERE hti.id = ht."harvestTransactionItemId";

-- Now make the columns NOT NULL
ALTER TABLE "File" ALTER COLUMN "portfolioId" SET NOT NULL;
ALTER TABLE "HarvestTransaction" ALTER COLUMN "portfolioId" SET NOT NULL;
ALTER TABLE "HarvestTransactionItem" ALTER COLUMN "portfolioId" SET NOT NULL;
ALTER TABLE "Lot" ALTER COLUMN "portfolioId" SET NOT NULL;
ALTER TABLE "Position" ALTER COLUMN "portfolioId" SET NOT NULL;
ALTER TABLE "RealizedPAndL" ALTER COLUMN "portfolioId" SET NOT NULL;
ALTER TABLE "Transaction" ALTER COLUMN "portfolioId" SET NOT NULL;

-- Now we can safely use the new enum value
ALTER TABLE "Account" 
  ALTER COLUMN "provider" SET DEFAULT 'UNCONNECTED',
  ALTER COLUMN "institution" DROP NOT NULL,
  ALTER COLUMN "type" SET DEFAULT 'Unconnected';

-- AlterTable
ALTER TABLE "_AssetToUser" ADD CONSTRAINT "_AssetToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AssetToUser_AB_unique";

-- AddForeignKey
ALTER TABLE "HarvestTransaction" ADD CONSTRAINT "HarvestTransaction_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransactionItem" ADD CONSTRAINT "HarvestTransactionItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealizedPAndL" ADD CONSTRAINT "RealizedPAndL_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotChangeLog" ADD CONSTRAINT "LotChangeLog_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
