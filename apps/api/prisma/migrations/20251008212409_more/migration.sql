-- Enable RLS for the PortfolioConnect table
ALTER TABLE "PortfolioConnect" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortfolioConnect" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "PortfolioConnect" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "PortfolioConnect" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the LotUpload table
ALTER TABLE "LotUpload" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LotUpload" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "LotUpload" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "LotUpload" USING (current_setting('app.bypass_rls', true)::text = 'on');

-- Enable RLS for the LotUploadFile table
ALTER TABLE "LotUploadFile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LotUploadFile" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "LotUploadFile" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "LotUploadFile" USING (current_setting('app.bypass_rls', true)::text = 'on');