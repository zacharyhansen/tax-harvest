-- AlterTable
ALTER TABLE "LotChangeLog" ALTER COLUMN "lotId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LotChangeLog" ADD CONSTRAINT "LotChangeLog_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
