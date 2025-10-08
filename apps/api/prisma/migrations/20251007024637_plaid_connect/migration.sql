-- AlterTable
ALTER TABLE "public"."AuthConnection" ADD COLUMN     "pkPlaidInstitutionId" UUID;

-- CreateTable
CREATE TABLE "public"."PlaidInstitution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT[],
    "url" TEXT,
    "primaryColor" TEXT,
    "logo" TEXT,
    "oauth" BOOLEAN NOT NULL DEFAULT false,
    "products" TEXT[],
    "routingNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dtcNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" JSONB NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaidInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaidInstitution_institutionId_key" ON "public"."PlaidInstitution"("institutionId");

-- CreateIndex
CREATE INDEX "PlaidInstitution_name_idx" ON "public"."PlaidInstitution"("name");

-- CreateIndex
CREATE INDEX "PlaidInstitution_lastSyncedAt_idx" ON "public"."PlaidInstitution"("lastSyncedAt");

-- AddForeignKey
ALTER TABLE "public"."PorfolioConnect" ADD CONSTRAINT "PorfolioConnect_plaidInstitutionId_fkey" FOREIGN KEY ("plaidInstitutionId") REFERENCES "public"."PlaidInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthConnection" ADD CONSTRAINT "AuthConnection_pkPlaidInstitutionId_fkey" FOREIGN KEY ("pkPlaidInstitutionId") REFERENCES "public"."PlaidInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
