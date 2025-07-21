--  Manual
GRANT USAGE ON SCHEMA public TO app_user;

GRANT
SELECT
,
    INSERT,
UPDATE,
DELETE ON ALL TABLES IN SCHEMA public TO app_user;

GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA public TO app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT
SELECT
,
    INSERT,
UPDATE,
DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE,
SELECT
    ON SEQUENCES TO app_user;

-- Create basic lot view
CREATE
OR REPLACE VIEW "LotCurrent" AS
SELECT
    id,
    "accountId",
    "remainingQty",
    "acquiredDate",
    price,
    "Asset".symbol AS symbol,
    "Asset"."lastPrice" AS "lastPrice",
    COALESCE("Lot"."remainingQty", 0) * COALESCE("Lot".price, 0) AS "costBasis",
    COALESCE("Lot"."remainingQty", 0) * COALESCE("Asset"."lastPrice", 0) AS value,
    COALESCE("Lot"."remainingQty", 0) * COALESCE("Asset"."lastPrice", 0) - COALESCE("Lot"."remainingQty", 0) * COALESCE("Lot".price, 0) AS "gainTotal",
    (
        COALESCE("Lot"."remainingQty", 0) * COALESCE("Asset"."lastPrice", 0) - COALESCE("Lot"."remainingQty", 0) * COALESCE("Lot".price, 0)
    ) / NULLIF(
        COALESCE("Lot"."remainingQty", 0) * COALESCE("Lot".price, 0),
        0
    ) * 100 AS "gainTotalPct",
    COALESCE("Asset"."lastPrice", 0) - COALESCE("Lot".price, 0) AS "dollarPerSharePnL",
    CAST(
        CASE
            WHEN CURRENT_DATE - "acquiredDate" >= INTERVAL '1 year' THEN 'LONG'
            ELSE 'SHORT'
        END AS "TaxGain"
    ) AS "taxGain"
FROM
    "Lot"
    LEFT JOIN "Asset" ON "Asset".symbol = "Lot"."assetSymbol";

-- Create the default unkowna asset as a fallback
INSERT INTO
    "Asset" ("symbol", "active")
VALUES
    ('UNKNOWN', true) ON CONFLICT ("symbol") DO
UPDATE
SET
    "active" = true;

-- Enable RLS for the Portfolio table
ALTER TABLE "Portfolio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Portfolio" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Portfolio" USING ("id" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Portfolio" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Portfolio table
ALTER TABLE "UsersOnPortfolios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UsersOnPortfolios" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "UsersOnPortfolios" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "UsersOnPortfolios" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Harvest table
ALTER TABLE "Harvest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Harvest" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Harvest" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Harvest" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the HarvestTransaction table
ALTER TABLE "HarvestTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HarvestTransaction" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "HarvestTransaction" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "HarvestTransaction" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the HarvestTransactionItem table
ALTER TABLE "HarvestTransactionItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HarvestTransactionItem" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "HarvestTransactionItem" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "HarvestTransactionItem" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Account table
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Account" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Account" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the RealizedPAndL table
ALTER TABLE "RealizedPAndL" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RealizedPAndL" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "RealizedPAndL" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "RealizedPAndL" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Transaction table
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Transaction" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Transaction" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the LotTransactionBatch table
ALTER TABLE "LotTransactionBatch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LotTransactionBatch" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "LotTransactionBatch" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "LotTransactionBatch" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the LotChangeLog table
ALTER TABLE "LotChangeLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LotChangeLog" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "LotChangeLog" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "LotChangeLog" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Position table
ALTER TABLE "Position" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Position" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Position" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Position" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Lot table
ALTER TABLE "Lot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lot" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Lot" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Lot" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the AuthConnection table
ALTER TABLE "AuthConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuthConnection" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "AuthConnection" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "AuthConnection" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the File table
ALTER TABLE "File" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "File" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "File" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "File" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the Log table
ALTER TABLE "Log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Log" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Log" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Log" USING (current_setting('app.bypass_rls', true)::text = 'on');
