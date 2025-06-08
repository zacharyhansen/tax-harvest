-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "PlaidLinkStatus" AS ENUM ('NONE', 'CREATED', 'SESSION_FINISHED', 'SYNCED');

-- CreateEnum
CREATE TYPE "HarvestType" AS ENUM ('SELL', 'REDUCE_COST_BASIS', 'REDUCE_TAXES', 'CAPTURE_GAINS_TAX_FREE');

-- CreateEnum
CREATE TYPE "HarvestStep" AS ENUM ('CONFIGURE', 'REVIEW', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TaxGain" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "PortfolioRole" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "AssetLocale" AS ENUM ('us', 'global');

-- CreateEnum
CREATE TYPE "AssetClass" AS ENUM ('stocks', 'cryto', 'fx', 'otc', 'indices', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "VectorWindow" AS ENUM ('MONTH_1', 'MONTH_3', 'MONTH_6', 'YEAR_1', 'YEAR_2');

-- CreateEnum
CREATE TYPE "Graph" AS ENUM ('RETURN_PCT_LINE');

-- CreateEnum
CREATE TYPE "AuthSource" AS ENUM ('ETRADE_REQUEST', 'ETRADE_ACCESS', 'PLAID', 'LOCAL');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('OAUTH_1', 'PLAID_LINK');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('ETRADE_LOTS');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('EXTERNAL_SYNC', 'AUTH');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('BUY', 'SELL', 'SELL_TO_CLOSE', 'SELL_TO_OPEN', 'BUY_TO_CLOSE', 'BUY_TO_OPEN');

-- CreateEnum
CREATE TYPE "EtradeAccountType" AS ENUM ('AMMCHK', 'ARO', 'BCHK', 'BENFIRA', 'BENFROTHIRA', 'BENF_ESTATE_IRA', 'BENF_MINOR_IRA', 'BENF_ROTH_ESTATE_IRA', 'BENF_ROTH_MINOR_IRA', 'BENF_ROTH_TRUST_IRA', 'BENF_TRUST_IRA', 'BRKCD', 'BROKER', 'CASH', 'C_CORP', 'CONTRIBUTORY', 'COVERDELL_ESA', 'CONVERSION_ROTH_IRA', 'COMM_PROP', 'CONSERVATOR', 'CORPORATION', 'CSA', 'CUSTODIAL', 'DVP', 'ESTATE', 'EMPCHK', 'EMPMMCA', 'ETCHK', 'ETMMCHK', 'HEIL', 'HELOC', 'INDCHK', 'INDIVIDUAL', 'INDIVIDUAL_K', 'INVCLUB', 'INVCLUB_C_CORP', 'INVCLUB_LLC_C_CORP', 'INVCLUB_LLC_PARTNERSHIP', 'INVCLUB_LLC_S_CORP', 'INVCLUB_PARTNERSHIP', 'INVCLUB_S_CORP', 'INVCLUB_TRUST', 'IRA_ROLLOVER', 'JOINT', 'JTTEN', 'JTWROS', 'LLC_C_CORP', 'LLC_PARTNERSHIP', 'LLC_S_CORP', 'LLP', 'LLP_C_CORP', 'LLP_S_CORP', 'IRA', 'IRACD', 'MONEY_PURCHASE', 'MARGIN', 'MRCHK', 'MUTUAL_FUND', 'NONCUSTODIAL', 'NON_PROFIT', 'OTHER', 'PARTNER', 'PARTNERSHIP', 'PARTNERSHIP_C_CORP', 'PARTNERSHIP_S_CORP', 'PDT_ACCOUNT', 'PM_ACCOUNT', 'PREFCD', 'PREFIRACD', 'PROFIT_SHARING', 'PROPRIETARY', 'REGCD', 'ROTHIRA', 'ROTH_INDIVIDUAL_K', 'ROTH_IRA_MINORS', 'SARSEPIRA', 'S_CORP', 'SEPIRA', 'SIMPLE_IRA', 'TIC', 'TRD_IRA_MINORS', 'TRUST', 'VARCD', 'VARIRACD');

-- CreateEnum
CREATE TYPE "AccountInstitution" AS ENUM ('BROKERAGE', 'GLOBALTRADING', 'NONUS', 'STOCKPLAN', 'LENDING', 'HELOC', 'HEIL', 'ONTRACK', 'GENPACT', 'AUTO', 'AUTOLOAN', 'BETA', 'LOYALTY', 'SBASKET', 'CC_BALANCETRANSFER', 'GENPACT_LEAD', 'GANIS', 'MORTGAGE', 'EXTERNAL', 'FUTURES', 'VISA', 'RJO', 'WDBH');

-- CreateEnum
CREATE TYPE "AccountMode" AS ENUM ('CASH', 'MARGIN', 'CHECKING', 'IRA', 'SAVINGS', 'CD');

-- CreateEnum
CREATE TYPE "AccountProvider" AS ENUM ('ETRADE', 'PLAID', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "OptionLevel" AS ENUM ('NO_OPTIONS', 'LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "plaidCustomerId" TEXT,
    "plaidUserToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "phoneNumber" TEXT,
    "hashedRefreshToken" TEXT,
    "name" TEXT,
    "photo" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Main',
    "harvestCycleWeeks" INTEGER NOT NULL DEFAULT 4,
    "harvestShareDollarThreshold" DECIMAL(14,2) NOT NULL DEFAULT 0.01,
    "harvestTickerBucketDollarSizeLong" DECIMAL(14,2) NOT NULL DEFAULT 1500,
    "harvestTickerBucketLowerLimitLong" DECIMAL(14,2) NOT NULL DEFAULT 0.01,
    "harvestTickerBucketDollarSizeShort" DECIMAL(14,2) NOT NULL DEFAULT 1000,
    "harvestTickerBucketLowerLimitShort" DECIMAL(14,2) NOT NULL DEFAULT 0.01,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Harvest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "portfolioId" UUID NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "HarvestType" NOT NULL,
    "step" "HarvestStep" NOT NULL DEFAULT 'CONFIGURE',

    CONSTRAINT "Harvest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestTransaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "harvestId" UUID NOT NULL,
    "counterTransaction" BOOLEAN NOT NULL DEFAULT false,
    "revertDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revert" BOOLEAN NOT NULL DEFAULT true,
    "notify" BOOLEAN NOT NULL DEFAULT true,
    "harvestTransactionItemId" UUID NOT NULL,
    "replacementTransactionItemId" UUID,
    "revertHarvestTransactionItemId" UUID,
    "revertReplacementTransactionItemId" UUID,

    CONSTRAINT "HarvestTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestTransactionItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderType" "OrderType" NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "completedDate" TIMESTAMP(3),
    "lotId" UUID,
    "quantity" DECIMAL(14,4) NOT NULL,
    "price" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "HarvestTransactionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" "AccountProvider" NOT NULL DEFAULT 'SYSTEM',
    "authConnectionId" UUID NOT NULL,
    "externalId" TEXT,
    "plaidAccountName" TEXT,
    "plaidAccountMask" TEXT,
    "key" TEXT,
    "createdById" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT 'New Account',
    "description" TEXT,
    "institution" "AccountInstitution" NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Unknown',
    "subType" TEXT,
    "mode" "AccountMode",
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "portfolioId" UUID NOT NULL,
    "closedDate" TIMESTAMP(3),
    "optionLevel" "OptionLevel",
    "uploadedPositions" BOOLEAN NOT NULL DEFAULT false,
    "setRealizedValues" BOOLEAN NOT NULL DEFAULT false,
    "liveURL" TEXT,
    "liveURLCreated" TIMESTAMP(3),
    "cashForOpenOrders" DECIMAL(14,4),
    "balanceMoneyMarket" DECIMAL(14,4),
    "accountValueTotal" DECIMAL(14,4),
    "marketValueTotal" DECIMAL(14,4),
    "cashAvailableForInvestment" DECIMAL(14,4),
    "cashNet" DECIMAL(14,4),
    "cashBalance" DECIMAL(14,4),
    "cashSettledForInvestment" DECIMAL(14,4),
    "cashUnsettledForInvestment" DECIMAL(14,4),
    "cashBuyingPower" DECIMAL(14,4),
    "fundsWithheldFromPurchasingPower" DECIMAL(14,4),
    "fundsWithheldFromWithdrawal" DECIMAL(14,4),
    "marginBuyingPower" DECIMAL(14,4),
    "marginBuyingPowerDT" DECIMAL(14,4),
    "balanceShortAdjustment" DECIMAL(14,4),
    "balanceAccount" DECIMAL(14,4),
    "equityRegt" DECIMAL(14,4),
    "equityRegtPercent" DECIMAL(14,4),
    "cashOpenOrderReserveDT" DECIMAL(14,4),
    "marginOpenOrderReserveDT" DECIMAL(14,4),
    "raw" JSONB,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealizedPAndL" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "shortTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "longTerm" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "dividend" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "deferredLoss" DECIMAL(14,4) NOT NULL DEFAULT 0,

    CONSTRAINT "RealizedPAndL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalId" TEXT NOT NULL,
    "accountId" UUID NOT NULL,
    "securityType" TEXT,
    "type" TEXT,
    "subtype" TEXT,
    "transactionDate" TIMESTAMP(3),
    "postDate" TIMESTAMP(3),
    "settlementDate" TIMESTAMP(3),
    "description" TEXT,
    "datailsURI" TEXT,
    "memo" TEXT,
    "assetSymbol" TEXT NOT NULL,
    "quantity" DECIMAL(14,4),
    "price" DECIMAL(14,4),
    "amount" DECIMAL(14,4),
    "settlementCurrency" TEXT,
    "paymentCurrency" TEXT,
    "fee" DECIMAL(14,4),
    "displaySymbol" TEXT,
    "detailsURI" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" UUID NOT NULL,
    "externalId" TEXT,
    "dateAcquired" TIMESTAMP(3),
    "dateExpiration" TIMESTAMP(3),
    "assetSymbol" TEXT NOT NULL,
    "pricePaid" DECIMAL(14,4),
    "quantity" DECIMAL(14,4) NOT NULL,
    "type" TEXT,
    "commissionTotal" DECIMAL(14,4),
    "feesOther" DECIMAL(14,4),
    "feesDay" DECIMAL(14,4),
    "gainDay" DECIMAL(14,4),
    "marketValue" DECIMAL(14,4),
    "costTotal" DECIMAL(14,4),
    "gainTotal" DECIMAL(14,4),
    "gainTotalPCT" DECIMAL(14,4),
    "costPerShare" DECIMAL(14,4),
    "commissionDay" DECIMAL(14,4),
    "changePCT" DECIMAL(14,4),
    "change" DECIMAL(14,4),
    "quoteStatus" TEXT,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "positionId" UUID,
    "accountId" UUID NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "externalId" TEXT,
    "excludeFromHarvest" INTEGER NOT NULL DEFAULT 0,
    "fileId" UUID,
    "price" DECIMAL(14,4),
    "gainDay" DECIMAL(14,4),
    "gainDayPct" DECIMAL(14,4),
    "marketValue" DECIMAL(14,4),
    "costTotal" DECIMAL(14,4),
    "totalCostForGainPct" DECIMAL(14,4),
    "gainTotal" DECIMAL(14,4),
    "originalQty" DECIMAL(14,4),
    "remainingQty" DECIMAL(14,4),
    "availableQty" DECIMAL(14,4),
    "orderNo" DECIMAL(14,4),
    "acquiredDate" TIMESTAMP(3),
    "exchangeRate" DECIMAL(14,4),
    "settlementCurrency" TEXT DEFAULT 'USD',
    "paymentCurrency" TEXT DEFAULT 'USD',
    "adjPrice" DECIMAL(14,4),
    "commPerShare" DECIMAL(14,4),
    "feesPerShare" DECIMAL(14,4),
    "lotSourceCode" INTEGER,
    "termCode" INTEGER,
    "legNo" INTEGER,
    "locationCode" INTEGER,
    "shortType" INTEGER,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnPortfolios" (
    "userId" TEXT NOT NULL,
    "portfolioId" UUID NOT NULL,
    "role" "PortfolioRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnPortfolios_pkey" PRIMARY KEY ("userId","portfolioId")
);

-- CreateTable
CREATE TABLE "AssetType" (
    "code" TEXT NOT NULL,
    "assetClass" "AssetClass" NOT NULL,
    "description" TEXT NOT NULL,
    "locale" "AssetLocale" NOT NULL,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Asset" (
    "symbol" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "plaid_security_id" TEXT,
    "lastPrice" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastOpen" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastClose" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastLow" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastHigh" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastVolume" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastVolumeWeighted" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "todaysChange" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "todaysChangePerc" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "iconUrl" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "homepageUrl" TEXT,
    "listDate" TIMESTAMP(3),
    "cik" TEXT,
    "compositeFigi" TEXT,
    "currencyName" TEXT,
    "delistedDate" TIMESTAMP(3),
    "locale" "AssetLocale" NOT NULL DEFAULT 'us',
    "assetClass" "AssetClass" NOT NULL DEFAULT 'UNKNOWN',
    "type" TEXT NOT NULL DEFAULT 'Unknown',
    "marketCap" DECIMAL(16,0),
    "name" TEXT,
    "primaryExchange" TEXT,
    "shareClassSharesOutstanding" DECIMAL(16,0),
    "sicCode" TEXT,
    "sicDescription" TEXT,
    "totalEmployees" INTEGER,
    "assetTypeCode" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "PriceHourly" (
    "open" INTEGER NOT NULL,
    "close" INTEGER NOT NULL,
    "high" INTEGER NOT NULL,
    "low" INTEGER NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "numberOfTransactions" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "volumeWeightAverage" INTEGER NOT NULL,
    "volume" INTEGER NOT NULL,

    CONSTRAINT "PriceHourly_pkey" PRIMARY KEY ("assetSymbol","startDate")
);

-- CreateTable
CREATE TABLE "PriceHourlyVector" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assetSymbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "vectorWindow" "VectorWindow" NOT NULL,
    "vector" vector(1060),

    CONSTRAINT "PriceHourlyVector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VectorGraph" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "Graph" NOT NULL,
    "priceHourlyVectorId" UUID NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "data" JSONB[],

    CONSTRAINT "VectorGraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthConnection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "portfolioId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "AuthSource" NOT NULL,
    "type" "AuthType" NOT NULL,
    "verificationUrl" TEXT,
    "externalId" TEXT NOT NULL,
    "isSyncing" BOOLEAN NOT NULL DEFAULT false,
    "authedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3),
    "token" TEXT,
    "secret" TEXT,
    "verifier" TEXT,

    CONSTRAINT "AuthConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gcpFilename" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    "accountId" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL DEFAULT 'ETRADE_LOTS',

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "type" "LogType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "AuthSource",
    "description" TEXT,
    "responseStatus" INTEGER,
    "data" JSONB NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssetToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestTransaction_harvestTransactionItemId_key" ON "HarvestTransaction"("harvestTransactionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestTransaction_replacementTransactionItemId_key" ON "HarvestTransaction"("replacementTransactionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestTransaction_revertHarvestTransactionItemId_key" ON "HarvestTransaction"("revertHarvestTransactionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestTransaction_revertReplacementTransactionItemId_key" ON "HarvestTransaction"("revertReplacementTransactionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_externalId_key" ON "Account"("provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "RealizedPAndL_accountId_year_key" ON "RealizedPAndL"("accountId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_accountId_externalId_key" ON "Transaction"("accountId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_accountId_externalId_key" ON "Position"("accountId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Lot_positionId_externalId_key" ON "Lot"("positionId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_plaid_security_id_key" ON "Asset"("plaid_security_id");

-- CreateIndex
CREATE UNIQUE INDEX "PriceHourlyVector_assetSymbol_startDate_vectorWindow_key" ON "PriceHourlyVector"("assetSymbol", "startDate", "vectorWindow");

-- CreateIndex
CREATE UNIQUE INDEX "VectorGraph_assetSymbol_type_priceHourlyVectorId_key" ON "VectorGraph"("assetSymbol", "type", "priceHourlyVectorId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthConnection_source_userId_portfolioId_externalId_key" ON "AuthConnection"("source", "userId", "portfolioId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "_AssetToUser_AB_unique" ON "_AssetToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AssetToUser_B_index" ON "_AssetToUser"("B");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransaction" ADD CONSTRAINT "HarvestTransaction_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransaction" ADD CONSTRAINT "HarvestTransaction_harvestTransactionItemId_fkey" FOREIGN KEY ("harvestTransactionItemId") REFERENCES "HarvestTransactionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransaction" ADD CONSTRAINT "HarvestTransaction_replacementTransactionItemId_fkey" FOREIGN KEY ("replacementTransactionItemId") REFERENCES "HarvestTransactionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransaction" ADD CONSTRAINT "HarvestTransaction_revertHarvestTransactionItemId_fkey" FOREIGN KEY ("revertHarvestTransactionItemId") REFERENCES "HarvestTransactionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransaction" ADD CONSTRAINT "HarvestTransaction_revertReplacementTransactionItemId_fkey" FOREIGN KEY ("revertReplacementTransactionItemId") REFERENCES "HarvestTransactionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransactionItem" ADD CONSTRAINT "HarvestTransactionItem_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestTransactionItem" ADD CONSTRAINT "HarvestTransactionItem_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_authConnectionId_fkey" FOREIGN KEY ("authConnectionId") REFERENCES "AuthConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealizedPAndL" ADD CONSTRAINT "RealizedPAndL_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnPortfolios" ADD CONSTRAINT "UsersOnPortfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnPortfolios" ADD CONSTRAINT "UsersOnPortfolios_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetTypeCode_fkey" FOREIGN KEY ("assetTypeCode") REFERENCES "AssetType"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHourly" ADD CONSTRAINT "PriceHourly_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHourlyVector" ADD CONSTRAINT "PriceHourlyVector_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VectorGraph" ADD CONSTRAINT "VectorGraph_assetSymbol_fkey" FOREIGN KEY ("assetSymbol") REFERENCES "Asset"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VectorGraph" ADD CONSTRAINT "VectorGraph_priceHourlyVectorId_fkey" FOREIGN KEY ("priceHourlyVectorId") REFERENCES "PriceHourlyVector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthConnection" ADD CONSTRAINT "AuthConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthConnection" ADD CONSTRAINT "AuthConnection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssetToUser" ADD CONSTRAINT "_AssetToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssetToUser" ADD CONSTRAINT "_AssetToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
