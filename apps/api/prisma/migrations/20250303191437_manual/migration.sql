CREATE SCHEMA IF NOT EXISTS postgrest;

CREATE OR REPLACE FUNCTION create_role_if_not_exists(
    role_name text,
    with_login boolean DEFAULT false,
    with_noinherit boolean DEFAULT false,
    with_password text DEFAULT NULL
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
        DECLARE
            create_role_stmt text := format('CREATE ROLE %I', role_name);
        BEGIN
            IF with_noinherit THEN
                create_role_stmt := create_role_stmt || ' NOINHERIT';
            END IF;
            IF with_login THEN
                create_role_stmt := create_role_stmt || ' LOGIN';
            END IF;
            IF with_password IS NOT NULL THEN
                create_role_stmt := create_role_stmt || format(' PASSWORD %L', with_password);
            END IF;
            
            EXECUTE create_role_stmt;
            RAISE NOTICE 'Role "%" has been created', role_name;
        END;
    ELSE
        RAISE NOTICE 'Role "%" already exists, no action taken', role_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION postgrest.pre_config() RETURNS void AS $$
SELECT
    set_config(
        'pgrst.jwt_secret',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvnOiPTCR4APnNVFXDWdRZjgKkGFUQbU7DarpWVK66eGUUoTtKfYUK40vvwwTH7gNYPitBqHvxdVPHhqbjYnKYF8HEebqsX9B4O8LAOoeqq9jX/L/hYzVqmAaxeZHAH1GM4WCA7TQ6w/Tj2A4AcVv+vD28WX/GnbCtDui17UZ1CJCyc4JME6PqnZUXRJ4vNjQwo+5dIKtUY/KLtEa3K9Hs/HUedASkn8TPRXHKv7zBMXg2I1VWMSk5Qg+JCF0/eQHZnN3+U1Pzp8IcQW+T+bSdRLGEXsy9JyD53ItMU1PQ3J3M16CFEH3d4BsTSq4kwIFFVAUqW5w8MsN8udGAZLebQIDAQAB',
        true
    ),
    set_config(
        'pgrst.db_schemas',
        string_agg(nspname, ','),
        true
    )
from
    (
        -- select the relavant schema we watch for
        SELECT
            nspname
        FROM
            pg_namespace
        WHERE
            nspname LIKE 'tenant_%'
        UNION ALL
        SELECT
            'public'
        UNION ALL
        SELECT
            'foundation'
          UNION ALL
        SELECT
            'configuration'
    ) AS namespaces;
$$ language sql;

-- watch CREATE and ALTER
CREATE
OR REPLACE FUNCTION pgrst_ddl_watch() RETURNS event_trigger AS $$ DECLARE cmd record;
BEGIN FOR cmd IN
SELECT
    *
FROM
    pg_event_trigger_ddl_commands() LOOP IF cmd.command_tag IN (
        'CREATE SCHEMA',
        'ALTER SCHEMA',
        'CREATE TABLE',
        'CREATE TABLE AS',
        'SELECT INTO',
        'ALTER TABLE',
        'CREATE FOREIGN TABLE',
        'ALTER FOREIGN TABLE',
        'CREATE VIEW',
        'ALTER VIEW',
        'CREATE MATERIALIZED VIEW',
        'ALTER MATERIALIZED VIEW',
        'CREATE FUNCTION',
        'ALTER FUNCTION',
        'CREATE TRIGGER',
        'CREATE TYPE',
        'ALTER TYPE',
        'CREATE RULE',
        'COMMENT'
    ) -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct
from
    'pg_temp' THEN NOTIFY pgrst,
    'reload schema';
END IF;
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- watch DROP
CREATE
OR REPLACE FUNCTION pgrst_drop_watch() RETURNS event_trigger AS $$ DECLARE obj record;
BEGIN FOR obj IN
SELECT
    *
FROM
    pg_event_trigger_dropped_objects() LOOP IF obj.object_type IN (
        'schema',
        'table',
        'foreign table',
        'view',
        'materialized view',
        'function',
        'trigger',
        'type',
        'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN NOTIFY pgrst,
    'reload schema';
END IF;
END LOOP;
END;
$$ LANGUAGE plpgsql;
CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end EXECUTE PROCEDURE pgrst_ddl_watch();
CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop EXECUTE PROCEDURE pgrst_drop_watch();

-- TODO: Need to inject this somehow
SELECT create_role_if_not_exists('authenticator', true, true, 'secretpassword');

SELECT create_role_if_not_exists('super_admin', false, false);
GRANT super_admin TO authenticator;

SELECT create_role_if_not_exists('anonymous', false, false);
GRANT anonymous TO authenticator;

-- start super_admin role privileges
GRANT USAGE ON SCHEMA public TO super_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO super_admin;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO super_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO super_admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO super_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO super_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO super_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO super_admin;
-- end super_admin role privileges

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


