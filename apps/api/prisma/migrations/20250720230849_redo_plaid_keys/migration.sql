/*
  Warnings:

  - A unique constraint covering the columns `[authConnectionId,plaidAccountMask,type]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source,userId,portfolioId,plaidInstitutionId]` on the table `AuthConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_provider_externalId_key";

-- DropIndex
DROP INDEX "AuthConnection_source_userId_portfolioId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Account_authConnectionId_plaidAccountMask_type_key" ON "Account"("authConnectionId", "plaidAccountMask", "type");

-- CreateIndex
CREATE UNIQUE INDEX "AuthConnection_source_userId_portfolioId_plaidInstitutionId_key" ON "AuthConnection"("source", "userId", "portfolioId", "plaidInstitutionId");
