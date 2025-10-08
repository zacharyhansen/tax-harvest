/*
  Warnings:

  - A unique constraint covering the columns `[authConnectionId]` on the table `PortfolioConnect` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PortfolioConnect_authConnectionId_key" ON "public"."PortfolioConnect"("authConnectionId");
