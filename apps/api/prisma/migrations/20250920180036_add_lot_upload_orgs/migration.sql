-- CreateEnum
CREATE TYPE "public"."LotUploadFileType" AS ENUM ('ETRADE_LOTS', 'SCHWAB_LOTS', 'SCHWAB_POSITIONS');

-- CreateEnum
CREATE TYPE "public"."SupportedAccountLotProvider" AS ENUM ('ETRADE', 'SCHWAB');

-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "supportedLotProvider" "public"."SupportedAccountLotProvider" DEFAULT 'ETRADE';

-- CreateTable
CREATE TABLE "public"."LotUpload" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "appliedToLots" BOOLEAN NOT NULL DEFAULT false,
    "supportedAccountLotProvider" "public"."SupportedAccountLotProvider" NOT NULL,

    CONSTRAINT "LotUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LotUploadFile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "fileId" UUID,
    "type" "public"."LotUploadFileType" NOT NULL,
    "lotUploadId" UUID NOT NULL,

    CONSTRAINT "LotUploadFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LotUpload" ADD CONSTRAINT "LotUpload_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotUpload" ADD CONSTRAINT "LotUpload_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotUploadFile" ADD CONSTRAINT "LotUploadFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotUploadFile" ADD CONSTRAINT "LotUploadFile_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotUploadFile" ADD CONSTRAINT "LotUploadFile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LotUploadFile" ADD CONSTRAINT "LotUploadFile_lotUploadId_fkey" FOREIGN KEY ("lotUploadId") REFERENCES "public"."LotUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
