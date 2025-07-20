/*
  Warnings:

  - A unique constraint covering the columns `[source,userId,portfolioId]` on the table `AuthConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AuthConnection_source_userId_portfolioId_externalId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AuthConnection_source_userId_portfolioId_key" ON "AuthConnection"("source", "userId", "portfolioId");
