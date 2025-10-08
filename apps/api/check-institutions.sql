SELECT 
  "institutionId",
  "name",
  LENGTH("logo") as logo_length,
  LEFT("logo", 50) as logo_preview,
  "primaryColor",
  "lastSyncedAt"
FROM "PlaidInstitution"
LIMIT 5;
