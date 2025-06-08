--  Manual
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
    "Asset" ("symbol")
VALUES
    ('UNKNOWN');