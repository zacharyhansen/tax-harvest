-- AlterTable
ALTER TABLE "public"."LotUploadFile" ADD COLUMN     "assetSymbol" TEXT;

-- AddForeignKey
ALTER TABLE "public"."LotUploadFile" ADD CONSTRAINT "LotUploadFile_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "public"."Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
