-- Always filter out empty lots on read for app_user (this accomplishes soft delete for lots)
-- migration user can still see them (use this for admin queries)
CREATE POLICY hide_zero_quantity
ON "Lot"
FOR SELECT
TO app_user
USING ("remainingQty" <> 0);