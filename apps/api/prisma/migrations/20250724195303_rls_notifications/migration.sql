-- Enable RLS for the Notification table
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON "Notification" USING ("portfolioId" = current_setting('app.current_portfolio_id')::uuid);
CREATE POLICY bypass_rls_policy ON "Notification" USING (current_setting('app.bypass_rls', true)::text = 'on');