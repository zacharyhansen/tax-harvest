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
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "HarvestTransaction" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "HarvestTransactionItem" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RealizedPAndL" ADD COLUMN     "portfolioId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "portfolioId" UUID NOT NULL;

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
