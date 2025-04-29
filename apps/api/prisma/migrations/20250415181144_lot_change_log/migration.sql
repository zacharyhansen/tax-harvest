-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('create', 'update', 'delete');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "lotSeededDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "LotChangeLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operationType" "OperationType" NOT NULL,
    "lotId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "payloadBefore" JSONB,
    "payloadAfter" JSONB,
    "source" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LotChangeLog_pkey" PRIMARY KEY ("id")
);
