-- This is an empty migration.

-- Upsert the UNKNOWN asset as a fallback
INSERT INTO "Asset" ("symbol", "active", "lastPrice", "lastOpen", "lastClose", "lastLow", "lastHigh", "lastVolume", "lastVolumeWeighted", "todaysChange", "todaysChangePerc", "lastUpdated", "locale", "assetClass", "type")
VALUES ('UNKNOWN', true, 0, 0, 0, 0, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP, 'us', 'UNKNOWN', 'Unknown')
ON CONFLICT ("symbol") DO UPDATE 
SET 
    "active" = true,
    "lastUpdated" = CURRENT_TIMESTAMP,
    "locale" = 'us',
    "assetClass" = 'UNKNOWN',
    "type" = 'Unknown';