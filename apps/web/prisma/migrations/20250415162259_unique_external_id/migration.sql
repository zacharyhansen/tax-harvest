/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `AuthConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AuthConnection_externalId_key" ON "AuthConnection"("externalId");

-- CreateIndex
CREATE INDEX "AuthConnection_externalId_idx" ON "AuthConnection"("externalId");
