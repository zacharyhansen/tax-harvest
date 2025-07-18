INSERT INTO
  "Asset" ("symbol", "active")
VALUES
  ('UNKNOWN', true) ON CONFLICT ("symbol") DO
UPDATE
SET
  "active" = true;