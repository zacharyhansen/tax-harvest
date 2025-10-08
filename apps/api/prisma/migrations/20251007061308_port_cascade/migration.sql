-- DropForeignKey
ALTER TABLE "public"."Harvest" DROP CONSTRAINT "Harvest_portfolioId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Harvest" ADD CONSTRAINT "Harvest_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
