-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "configuration";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "foundation";

-- CreateEnum
CREATE TYPE "auth"."tenant" AS ENUM ('foundation_tenant');

-- CreateEnum
CREATE TYPE "auth"."schema" AS ENUM ('foundation');

-- CreateEnum
CREATE TYPE "auth"."env" AS ENUM ('uat', 'prod');

-- CreateEnum
CREATE TYPE "configuration"."view_type" AS ENUM ('product', 'custom');

-- CreateEnum
CREATE TYPE "configuration"."link_type" AS ENUM ('M2O', 'O2M', 'M2M', 'O2O');

-- CreateEnum
CREATE TYPE "configuration"."input_type" AS ENUM ('text', 'phone', 'password', 'textarea', 'number', 'percentage', 'usd', 'combobox', 'combobox_multi', 'date', 'timestamp', 'checkbox', 'switch', 'tiptap', 'slider', 'user');

-- CreateEnum
CREATE TYPE "configuration"."ag_pinned" AS ENUM ('left', 'right');

-- CreateEnum
CREATE TYPE "configuration"."supported_pg_data_type" AS ENUM ('unknown', 'array_integer', 'array_json', 'array_jsonb', 'array_text', 'array_boolean', 'array_numeric', 'array_varchar', 'array_date', 'array_timestamp', 'bigint', 'bigserial', 'bit', 'bit_varying', 'boolean', 'box', 'bytea', 'character', 'character_varying', 'cidr', 'circle', 'date', 'double_precision', 'enum', 'float4', 'float8', 'inet', 'integer', 'interval', 'json', 'jsonb', 'line', 'lseg', 'macaddr', 'money', 'numeric', 'path', 'point', 'polygon', 'real', 'serial', 'smallint', 'smallserial', 'text', 'time', 'time_with_time_zone', 'timestamp', 'timestamp_with_time_zone', 'timestamp_without_time_zone', 'tsquery', 'tsvector', 'txid_snapshot', 'uuid', 'xml');

-- CreateEnum
CREATE TYPE "configuration"."component_type" AS ENUM ('form', 'table', 'layout');

-- CreateEnum
CREATE TYPE "public"."property_type" AS ENUM ('commercial', 'residential');

-- CreateEnum
CREATE TYPE "public"."building_type" AS ENUM ('condo', 'multi_family', 'single_family');

-- CreateEnum
CREATE TYPE "public"."environment_type" AS ENUM ('production', 'uat', 'development');

-- CreateEnum
CREATE TYPE "public"."state_usa" AS ENUM ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY');

-- CreateEnum
CREATE TYPE "public"."deal_event_type" AS ENUM ('update', 'state_change', 'event', 'error', 'info');

-- CreateTable
CREATE TABLE "auth"."business_unit" (
    "configuration_schema" "auth"."schema" NOT NULL,
    "tenant" "auth"."tenant" NOT NULL,

    CONSTRAINT "business_unit_pkey" PRIMARY KEY ("configuration_schema")
);

-- CreateTable
CREATE TABLE "auth"."environment" (
    "schema" "auth"."schema" NOT NULL,
    "clerk_id" VARCHAR(255) NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "env" "auth"."env" NOT NULL DEFAULT 'prod',
    "name" VARCHAR(255) NOT NULL,
    "tenant" "auth"."tenant" NOT NULL,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "environment_pkey" PRIMARY KEY ("schema")
);

-- CreateTable
CREATE TABLE "auth"."auth_user" (
    "clerk_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("clerk_id")
);

-- CreateTable
CREATE TABLE "configuration"."role" (
    "name" TEXT NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("configuration_schema","name")
);

-- CreateTable
CREATE TABLE "configuration"."view" (
    "name" TEXT NOT NULL,
    "type" "configuration"."view_type" NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "pg_primary_table" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pgt_deletable" BOOLEAN NOT NULL,
    "pgt_description" TEXT,
    "pgt_insertable" BOOLEAN NOT NULL,
    "pgt_is_view" BOOLEAN NOT NULL,
    "pgt_updatable" BOOLEAN NOT NULL,
    "pgt_pk_cols" TEXT[],

    CONSTRAINT "view_pkey" PRIMARY KEY ("configuration_schema","name")
);

-- CreateTable
CREATE TABLE "configuration"."column" (
    "name" TEXT NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view_name" TEXT NOT NULL,
    "default_input_type" "configuration"."input_type" NOT NULL,
    "pgt_default" TEXT,
    "pgt_description" TEXT,
    "pgt_enum" TEXT[],
    "pgt_max_len" INTEGER,
    "pgt_name" TEXT,
    "pgt_nominal_type" TEXT,
    "pgt_nullable" BOOLEAN NOT NULL,
    "pgt_type" TEXT NOT NULL,
    "data_type" "configuration"."supported_pg_data_type" NOT NULL,
    "is_pk" BOOLEAN NOT NULL DEFAULT false,
    "oid" INTEGER NOT NULL,
    "is_updatable" BOOLEAN NOT NULL DEFAULT false,
    "is_unique" BOOLEAN NOT NULL DEFAULT false,
    "pg_table" TEXT,
    "pg_column" TEXT,
    "table_id" INTEGER NOT NULL,
    "column_id" INTEGER NOT NULL,

    CONSTRAINT "column_pkey" PRIMARY KEY ("configuration_schema","view_name","name")
);

-- CreateTable
CREATE TABLE "configuration"."link" (
    "type" "configuration"."link_type" NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "constraint" TEXT NOT NULL,
    "pgt_columns" TEXT[],
    "source_view_name" TEXT NOT NULL,
    "source_column_name" TEXT NOT NULL,
    "target_view_name" TEXT NOT NULL,
    "target_column_name" TEXT NOT NULL,
    "pgt_is_self" BOOLEAN NOT NULL,
    "constraint_2" TEXT,
    "pgt_columns_2" TEXT[],
    "junction_view_name" TEXT,
    "junction_source_column_name" TEXT,
    "junction_target_column_name" TEXT,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("configuration_schema","source_view_name","source_column_name","target_view_name","target_column_name")
);

-- CreateTable
CREATE TABLE "configuration"."role_view" (
    "name" TEXT NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "role_name" TEXT NOT NULL,
    "view_name" TEXT NOT NULL,
    "pgt_deletable" BOOLEAN NOT NULL,
    "pgt_description" TEXT,
    "pgt_insertable" BOOLEAN NOT NULL,
    "pgt_is_view" BOOLEAN NOT NULL,
    "pgt_updatable" BOOLEAN NOT NULL,
    "pgt_pk_cols" TEXT[],

    CONSTRAINT "role_view_pkey" PRIMARY KEY ("configuration_schema","name")
);

-- CreateTable
CREATE TABLE "configuration"."role_column" (
    "name" TEXT NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "role_view_name" TEXT NOT NULL,
    "view_name" TEXT NOT NULL,

    CONSTRAINT "role_column_pkey" PRIMARY KEY ("configuration_schema","role_view_name","name")
);

-- CreateTable
CREATE TABLE "configuration"."role_link" (
    "type" "configuration"."link_type" NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "constraint" TEXT NOT NULL,
    "pgt_columns" TEXT[],
    "source_view_name" TEXT NOT NULL,
    "source_column_name" TEXT NOT NULL,
    "target_view_name" TEXT NOT NULL,
    "target_column_name" TEXT NOT NULL,
    "pgt_is_self" BOOLEAN NOT NULL,
    "constraint_2" TEXT,
    "pgt_columns_2" TEXT[],
    "junction_view_name" TEXT,
    "junction_source_column_name" TEXT,
    "junction_target_column_name" TEXT,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "role_link_pkey" PRIMARY KEY ("configuration_schema","source_view_name","source_column_name","target_view_name","target_column_name")
);

-- CreateTable
CREATE TABLE "configuration"."dataset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "cached" JSONB,
    "dataview_id" UUID,
    "query" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."dataset_link_filter" (
    "dataset_id" UUID NOT NULL,
    "source_view_name" TEXT NOT NULL,
    "source_column_name" TEXT NOT NULL,
    "target_view_name" TEXT NOT NULL,
    "target_column_name" TEXT NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "dataview_column_id" UUID NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "dataset_link_filter_pkey" PRIMARY KEY ("dataset_id","source_view_name","source_column_name","target_view_name","target_column_name")
);

-- CreateTable
CREATE TABLE "configuration"."dataview" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "dataset_id" UUID NOT NULL,
    "role_view_name" TEXT NOT NULL,
    "constraint" TEXT NOT NULL,

    CONSTRAINT "dataview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."dataview_column" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "parent_dataview_id" UUID NOT NULL,
    "role_view_name" TEXT NOT NULL,
    "role_column_name" TEXT NOT NULL,
    "child_dataview_id" UUID,
    "label" TEXT,
    "input_type" "configuration"."input_type" NOT NULL DEFAULT 'text',
    "description" TEXT,
    "header_group" TEXT,
    "ag_width" INTEGER NOT NULL DEFAULT 200,
    "ag_min_width" INTEGER NOT NULL DEFAULT 50,
    "ag_flex" INTEGER,
    "ag_editable" BOOLEAN NOT NULL DEFAULT false,
    "ag_resizable" BOOLEAN NOT NULL DEFAULT true,
    "ag_pinned" "configuration"."ag_pinned",
    "order" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "dataview_column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."layout" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(100) NOT NULL,
    "configuration_schema" "auth"."schema" NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rows" INTEGER NOT NULL DEFAULT 12,
    "columns" INTEGER NOT NULL DEFAULT 12,

    CONSTRAINT "layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."tile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "layout_id" UUID NOT NULL,
    "grid_start" INTEGER NOT NULL DEFAULT 0,
    "grid_end" INTEGER NOT NULL DEFAULT 12,
    "width" INTEGER NOT NULL DEFAULT 12,
    "height" INTEGER NOT NULL DEFAULT 4,
    "order" INTEGER NOT NULL DEFAULT 1,
    "label" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "default_open" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."widget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "tile_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."published_component_on_widget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "widget_id" UUID NOT NULL,
    "published_component_id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "published_component_on_widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."component" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "type" "configuration"."component_type" NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "created_by_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."component_version" (
    "configuration_schema" "auth"."schema" NOT NULL,
    "version" INTEGER NOT NULL,
    "type" "configuration"."component_type" NOT NULL,
    "component_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "slug" TEXT,
    "form_id" UUID,
    "table_id" UUID,
    "layout_id" UUID,

    CONSTRAINT "component_version_pkey" PRIMARY KEY ("component_id","version")
);

-- CreateTable
CREATE TABLE "configuration"."published_component" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "environment_schema" "auth"."schema" NOT NULL,
    "component_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3),
    "published_by_id" TEXT,
    "role_name" TEXT NOT NULL,
    "slug" TEXT,

    CONSTRAINT "published_component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."form" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataset_id" UUID NOT NULL,
    "form_section_id" UUID,
    "columns" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."form_section" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "form_id" UUID NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "is_repeated" BOOLEAN NOT NULL DEFAULT false,
    "border" BOOLEAN NOT NULL DEFAULT true,
    "columns" INTEGER NOT NULL DEFAULT 1,
    "parent_section_id" UUID,

    CONSTRAINT "form_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."field" (
    "configuration_schema" "auth"."schema" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "input_type" "configuration"."input_type" NOT NULL,
    "name_locked" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,
    "description" TEXT,
    "placeholder" TEXT,
    "default_value" TEXT,
    "options" JSONB NOT NULL DEFAULT '[]',
    "section_id" UUID NOT NULL,
    "form_id" UUID NOT NULL,

    CONSTRAINT "field_pkey" PRIMARY KEY ("form_id","name")
);

-- CreateTable
CREATE TABLE "configuration"."form_instance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL DEFAULT '',
    "values" JSONB NOT NULL DEFAULT '{}',
    "form_id" UUID NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "form_instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration"."table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "configuration_schema" "auth"."schema" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataset_id" UUID NOT NULL,

    CONSTRAINT "table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."user" (
    "user_id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "external_id" TEXT,
    "configuration_schema" "auth"."schema" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_name" TEXT NOT NULL,
    "address" TEXT,
    "address_line_2" TEXT,
    "city" VARCHAR(255),
    "zip" VARCHAR(255),
    "state" "public"."state_usa",
    "county" TEXT,
    "name" TEXT,
    "phone" VARCHAR(255),
    "ssn" VARCHAR(9),
    "date_of_birth" DATE,
    "credit_score" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "foundation"."deal_state" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "deal_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."opportunity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "label" TEXT,
    "active_deal_id" UUID,
    "created_by_id" TEXT NOT NULL,
    "borrower_user_id" TEXT,
    "borrower_business_id" UUID,
    "agent_id" TEXT,

    CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."deal_assignee" (
    "deal_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "deal_assignee_pkey" PRIMARY KEY ("deal_id","user_id")
);

-- CreateTable
CREATE TABLE "foundation"."deal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "winnability" INTEGER,
    "appetite" INTEGER,
    "loan_amount" DECIMAL(14,3),
    "interest_rate" DECIMAL(7,6),
    "loan_processing_fee" DECIMAL(10,3),
    "label" TEXT NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "deal_state_id" UUID NOT NULL,
    "ssbs_score" INTEGER,

    CONSTRAINT "deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."task_status" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "task_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."task_priority" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "task_priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_by_id" TEXT NOT NULL,
    "assignee_id" TEXT,
    "deal_id" UUID,
    "status_id" INTEGER NOT NULL,
    "priority_id" INTEGER NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."task_subscriber" (
    "task_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "task_subscriber_pkey" PRIMARY KEY ("user_id","task_id")
);

-- CreateTable
CREATE TABLE "foundation"."task_event" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "task_id" UUID NOT NULL,
    "comment" TEXT,
    "metadata" JSONB,
    "source" VARCHAR(255),

    CONSTRAINT "task_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."property" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "address" TEXT,
    "address_line_2" TEXT,
    "city" VARCHAR(255),
    "zip" VARCHAR(255),
    "state" "public"."state_usa",
    "county" TEXT,
    "building_type" "public"."building_type",
    "type" "public"."property_type",
    "tags" TEXT[],
    "year_built" INTEGER,
    "description" TEXT,
    "amenities" TEXT[],
    "area_sq_km" DOUBLE PRECISION,
    "last_census_at" TIMESTAMP(3),
    "deal_id" UUID NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."deal_user" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "deal_id" UUID NOT NULL,

    CONSTRAINT "deal_user_pkey" PRIMARY KEY ("deal_id","user_id")
);

-- CreateTable
CREATE TABLE "foundation"."business" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "duns" VARCHAR(9),
    "dba" VARCHAR(255),
    "tin" VARCHAR(9),
    "email" VARCHAR(255),
    "address" TEXT,
    "address_line_2" TEXT,
    "city" VARCHAR(255),
    "zip" VARCHAR(255),
    "state" "public"."state_usa",
    "county" TEXT,
    "name_display" TEXT,
    "name_legal" TEXT,
    "phone" TEXT,
    "business_type" TEXT,
    "industry" TEXT,
    "date_business_began" DATE,
    "revenue_average" DOUBLE PRECISION,
    "debt" DOUBLE PRECISION,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."business_user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "business_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_title" TEXT,
    "owernship" DOUBLE PRECISION,
    "income_average_monthly" DOUBLE PRECISION,
    "expense_average_monthly" DOUBLE PRECISION,

    CONSTRAINT "business_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."deal_event" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "deal_id" UUID NOT NULL,
    "type" "public"."deal_event_type" NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "source" VARCHAR(255),

    CONSTRAINT "deal_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "environment_schema_key" ON "auth"."environment"("schema");

-- CreateIndex
CREATE UNIQUE INDEX "environment_clerk_id_key" ON "auth"."environment"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_external_id_key" ON "auth"."environment"("external_id");

-- CreateIndex
CREATE INDEX "environment_clerk_id_idx" ON "auth"."environment"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_tenant_name_key" ON "auth"."environment"("tenant", "name");

-- CreateIndex
CREATE UNIQUE INDEX "environment_tenant_configuration_schema_env_key" ON "auth"."environment"("tenant", "configuration_schema", "env");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_clerk_id_key" ON "auth"."auth_user"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth"."auth_user"("email");

-- CreateIndex
CREATE INDEX "link_configuration_schema_source_view_name_idx" ON "configuration"."link"("configuration_schema", "source_view_name");

-- CreateIndex
CREATE UNIQUE INDEX "dataset_dataview_id_key" ON "configuration"."dataset"("dataview_id");

-- CreateIndex
CREATE INDEX "dataset_configuration_schema_id_idx" ON "configuration"."dataset"("configuration_schema", "id");

-- CreateIndex
CREATE INDEX "dataset_link_filter_dataset_id_idx" ON "configuration"."dataset_link_filter"("dataset_id");

-- CreateIndex
CREATE INDEX "dataview_dataset_id_idx" ON "configuration"."dataview"("dataset_id");

-- CreateIndex
CREATE UNIQUE INDEX "dataview_column_child_dataview_id_key" ON "configuration"."dataview_column"("child_dataview_id");

-- CreateIndex
CREATE INDEX "dataview_column_parent_dataview_id_idx" ON "configuration"."dataview_column"("parent_dataview_id");

-- CreateIndex
CREATE UNIQUE INDEX "dataview_column_parent_dataview_id_role_column_name_child_d_key" ON "configuration"."dataview_column"("parent_dataview_id", "role_column_name", "child_dataview_id");

-- CreateIndex
CREATE INDEX "tile_layout_id_idx" ON "configuration"."tile"("layout_id");

-- CreateIndex
CREATE INDEX "widget_tile_id_idx" ON "configuration"."widget"("tile_id");

-- CreateIndex
CREATE INDEX "published_component_on_widget_widget_id_idx" ON "configuration"."published_component_on_widget"("widget_id");

-- CreateIndex
CREATE UNIQUE INDEX "component_version_form_id_key" ON "configuration"."component_version"("form_id");

-- CreateIndex
CREATE UNIQUE INDEX "component_version_table_id_key" ON "configuration"."component_version"("table_id");

-- CreateIndex
CREATE UNIQUE INDEX "component_version_layout_id_key" ON "configuration"."component_version"("layout_id");

-- CreateIndex
CREATE UNIQUE INDEX "component_version_slug_version_role_name_key" ON "configuration"."component_version"("slug", "version", "role_name");

-- CreateIndex
CREATE INDEX "published_component_environment_schema_role_name_slug_idx" ON "configuration"."published_component"("environment_schema", "role_name", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "published_component_environment_schema_component_id_key" ON "configuration"."published_component"("environment_schema", "component_id");

-- CreateIndex
CREATE UNIQUE INDEX "published_component_environment_schema_role_name_slug_key" ON "configuration"."published_component"("environment_schema", "role_name", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "form_dataset_id_key" ON "configuration"."form"("dataset_id");

-- CreateIndex
CREATE UNIQUE INDEX "form_form_section_id_key" ON "configuration"."form"("form_section_id");

-- CreateIndex
CREATE INDEX "form_section_form_id_idx" ON "configuration"."form_section"("form_id");

-- CreateIndex
CREATE INDEX "field_form_id_idx" ON "configuration"."field"("form_id");

-- CreateIndex
CREATE INDEX "form_instance_form_id_idx" ON "configuration"."form_instance"("form_id");

-- CreateIndex
CREATE UNIQUE INDEX "table_dataset_id_key" ON "configuration"."table"("dataset_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "foundation"."user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "foundation"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_external_id_key" ON "foundation"."user"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_state_external_id_key" ON "foundation"."deal_state"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_state_label_key" ON "foundation"."deal_state"("label");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_external_id_key" ON "foundation"."opportunity"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_active_deal_id_key" ON "foundation"."opportunity"("active_deal_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_external_id_key" ON "foundation"."deal"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_status_external_id_key" ON "foundation"."task_status"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_status_label_key" ON "foundation"."task_status"("label");

-- CreateIndex
CREATE UNIQUE INDEX "task_priority_external_id_key" ON "foundation"."task_priority"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_priority_label_key" ON "foundation"."task_priority"("label");

-- CreateIndex
CREATE UNIQUE INDEX "task_external_id_key" ON "foundation"."task"("external_id");

-- CreateIndex
CREATE INDEX "task_event_timestamp_id_idx" ON "foundation"."task_event"("timestamp" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "task_event_task_id_timestamp_id_idx" ON "foundation"."task_event"("task_id", "timestamp" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "task_event_source_timestamp_id_idx" ON "foundation"."task_event"("source", "timestamp" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "property_external_id_key" ON "foundation"."property"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_external_id_key" ON "foundation"."business"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_duns_key" ON "foundation"."business"("duns");

-- CreateIndex
CREATE UNIQUE INDEX "business_dba_key" ON "foundation"."business"("dba");

-- CreateIndex
CREATE UNIQUE INDEX "business_tin_key" ON "foundation"."business"("tin");

-- CreateIndex
CREATE UNIQUE INDEX "business_user_business_id_user_id_key" ON "foundation"."business_user"("business_id", "user_id");

-- CreateIndex
CREATE INDEX "deal_event_timestamp_id_idx" ON "foundation"."deal_event"("timestamp" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "deal_event_deal_id_type_timestamp_id_idx" ON "foundation"."deal_event"("deal_id", "type", "timestamp" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "deal_event_source_timestamp_id_idx" ON "foundation"."deal_event"("source", "timestamp" DESC, "id" DESC);

-- AddForeignKey
ALTER TABLE "auth"."environment" ADD CONSTRAINT "environment_configuration_schema_fkey" FOREIGN KEY ("configuration_schema") REFERENCES "auth"."business_unit"("configuration_schema") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."column" ADD CONSTRAINT "column_configuration_schema_view_name_fkey" FOREIGN KEY ("configuration_schema", "view_name") REFERENCES "configuration"."view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_source_view_name_fkey" FOREIGN KEY ("configuration_schema", "source_view_name") REFERENCES "configuration"."view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_target_view_name_fkey" FOREIGN KEY ("configuration_schema", "target_view_name") REFERENCES "configuration"."view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_target_view_name_target_column_n_fkey" FOREIGN KEY ("configuration_schema", "target_view_name", "target_column_name") REFERENCES "configuration"."column"("configuration_schema", "view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_source_view_name_source_column_n_fkey" FOREIGN KEY ("configuration_schema", "source_view_name", "source_column_name") REFERENCES "configuration"."column"("configuration_schema", "view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_junction_view_name_fkey" FOREIGN KEY ("configuration_schema", "junction_view_name") REFERENCES "configuration"."view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_junction_view_name_junction_sour_fkey" FOREIGN KEY ("configuration_schema", "junction_view_name", "junction_source_column_name") REFERENCES "configuration"."column"("configuration_schema", "view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."link" ADD CONSTRAINT "link_configuration_schema_junction_view_name_junction_targ_fkey" FOREIGN KEY ("configuration_schema", "junction_view_name", "junction_target_column_name") REFERENCES "configuration"."column"("configuration_schema", "view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_view" ADD CONSTRAINT "role_view_configuration_schema_view_name_fkey" FOREIGN KEY ("configuration_schema", "view_name") REFERENCES "configuration"."view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_view" ADD CONSTRAINT "role_view_configuration_schema_role_name_fkey" FOREIGN KEY ("configuration_schema", "role_name") REFERENCES "configuration"."role"("configuration_schema", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_column" ADD CONSTRAINT "role_column_configuration_schema_role_view_name_fkey" FOREIGN KEY ("configuration_schema", "role_view_name") REFERENCES "configuration"."role_view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_column" ADD CONSTRAINT "role_column_configuration_schema_view_name_name_fkey" FOREIGN KEY ("configuration_schema", "view_name", "name") REFERENCES "configuration"."column"("configuration_schema", "view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_column" ADD CONSTRAINT "role_column_configuration_schema_view_name_fkey" FOREIGN KEY ("configuration_schema", "view_name") REFERENCES "configuration"."view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_configuration_schema_source_view_name_fkey" FOREIGN KEY ("configuration_schema", "source_view_name") REFERENCES "configuration"."role_view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_configuration_schema_source_view_name_source_col_fkey" FOREIGN KEY ("configuration_schema", "source_view_name", "source_column_name") REFERENCES "configuration"."role_column"("configuration_schema", "role_view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_configuration_schema_target_view_name_fkey" FOREIGN KEY ("configuration_schema", "target_view_name") REFERENCES "configuration"."role_view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_configuration_schema_target_view_name_target_col_fkey" FOREIGN KEY ("configuration_schema", "target_view_name", "target_column_name") REFERENCES "configuration"."role_column"("configuration_schema", "role_view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_configuration_schema_junction_view_name_fkey" FOREIGN KEY ("configuration_schema", "junction_view_name") REFERENCES "configuration"."role_view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_junction_source_column_fkey" FOREIGN KEY ("configuration_schema", "junction_view_name", "junction_source_column_name") REFERENCES "configuration"."role_column"("configuration_schema", "role_view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."role_link" ADD CONSTRAINT "role_link_junction_target_column_fkey" FOREIGN KEY ("configuration_schema", "junction_view_name", "junction_target_column_name") REFERENCES "configuration"."role_column"("configuration_schema", "role_view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataset" ADD CONSTRAINT "dataset_dataview_id_fkey" FOREIGN KEY ("dataview_id") REFERENCES "configuration"."dataview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataset_link_filter" ADD CONSTRAINT "dataset_link_filter_dataview_column_id_fkey" FOREIGN KEY ("dataview_column_id") REFERENCES "configuration"."dataview_column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataset_link_filter" ADD CONSTRAINT "dataset_link_filter_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "configuration"."dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataset_link_filter" ADD CONSTRAINT "dataset_link_filter_source_view_name_configuration_schema_fkey" FOREIGN KEY ("source_view_name", "configuration_schema") REFERENCES "configuration"."role_view"("name", "configuration_schema") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataset_link_filter" ADD CONSTRAINT "dataset_link_filter_target_view_name_configuration_schema_fkey" FOREIGN KEY ("target_view_name", "configuration_schema") REFERENCES "configuration"."role_view"("name", "configuration_schema") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataview" ADD CONSTRAINT "dataview_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "configuration"."dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataview" ADD CONSTRAINT "dataview_configuration_schema_role_view_name_fkey" FOREIGN KEY ("configuration_schema", "role_view_name") REFERENCES "configuration"."role_view"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataview_column" ADD CONSTRAINT "dataview_column_parent_dataview_id_fkey" FOREIGN KEY ("parent_dataview_id") REFERENCES "configuration"."dataview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataview_column" ADD CONSTRAINT "dataview_column_child_dataview_id_fkey" FOREIGN KEY ("child_dataview_id") REFERENCES "configuration"."dataview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."dataview_column" ADD CONSTRAINT "dataview_column_configuration_schema_role_view_name_role_c_fkey" FOREIGN KEY ("configuration_schema", "role_view_name", "role_column_name") REFERENCES "configuration"."role_column"("configuration_schema", "role_view_name", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."tile" ADD CONSTRAINT "tile_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "configuration"."layout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."widget" ADD CONSTRAINT "widget_tile_id_fkey" FOREIGN KEY ("tile_id") REFERENCES "configuration"."tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component_on_widget" ADD CONSTRAINT "published_component_on_widget_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "configuration"."widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component_on_widget" ADD CONSTRAINT "published_component_on_widget_published_component_id_fkey" FOREIGN KEY ("published_component_id") REFERENCES "configuration"."published_component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component" ADD CONSTRAINT "component_configuration_schema_role_name_fkey" FOREIGN KEY ("configuration_schema", "role_name") REFERENCES "configuration"."role"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component" ADD CONSTRAINT "component_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth"."auth_user"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component_version" ADD CONSTRAINT "component_version_configuration_schema_role_name_fkey" FOREIGN KEY ("configuration_schema", "role_name") REFERENCES "configuration"."role"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component_version" ADD CONSTRAINT "component_version_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "configuration"."form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component_version" ADD CONSTRAINT "component_version_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "configuration"."table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component_version" ADD CONSTRAINT "component_version_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "configuration"."layout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component_version" ADD CONSTRAINT "component_version_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "configuration"."component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."component_version" ADD CONSTRAINT "component_version_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth"."auth_user"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component" ADD CONSTRAINT "published_component_configuration_schema_role_name_fkey" FOREIGN KEY ("configuration_schema", "role_name") REFERENCES "configuration"."role"("configuration_schema", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component" ADD CONSTRAINT "published_component_environment_schema_fkey" FOREIGN KEY ("environment_schema") REFERENCES "auth"."environment"("schema") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component" ADD CONSTRAINT "published_component_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "configuration"."component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component" ADD CONSTRAINT "published_component_component_id_version_fkey" FOREIGN KEY ("component_id", "version") REFERENCES "configuration"."component_version"("component_id", "version") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."published_component" ADD CONSTRAINT "published_component_published_by_id_fkey" FOREIGN KEY ("published_by_id") REFERENCES "auth"."auth_user"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."form" ADD CONSTRAINT "form_form_section_id_fkey" FOREIGN KEY ("form_section_id") REFERENCES "configuration"."form_section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."form" ADD CONSTRAINT "form_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "configuration"."dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."form_section" ADD CONSTRAINT "form_section_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "configuration"."form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."form_section" ADD CONSTRAINT "form_section_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "configuration"."form_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."field" ADD CONSTRAINT "field_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "configuration"."form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."field" ADD CONSTRAINT "field_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "configuration"."form_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."form_instance" ADD CONSTRAINT "form_instance_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth"."auth_user"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."form_instance" ADD CONSTRAINT "form_instance_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "configuration"."form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration"."table" ADD CONSTRAINT "table_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "configuration"."dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."user" ADD CONSTRAINT "user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."auth_user"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."user" ADD CONSTRAINT "user_role_name_configuration_schema_fkey" FOREIGN KEY ("role_name", "configuration_schema") REFERENCES "configuration"."role"("name", "configuration_schema") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."opportunity" ADD CONSTRAINT "opportunity_active_deal_id_fkey" FOREIGN KEY ("active_deal_id") REFERENCES "foundation"."deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."opportunity" ADD CONSTRAINT "opportunity_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "foundation"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."opportunity" ADD CONSTRAINT "opportunity_borrower_business_id_fkey" FOREIGN KEY ("borrower_business_id") REFERENCES "foundation"."business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."opportunity" ADD CONSTRAINT "opportunity_borrower_user_id_fkey" FOREIGN KEY ("borrower_user_id") REFERENCES "foundation"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."opportunity" ADD CONSTRAINT "opportunity_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "foundation"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal_assignee" ADD CONSTRAINT "deal_assignee_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "foundation"."deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal_assignee" ADD CONSTRAINT "deal_assignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "foundation"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal" ADD CONSTRAINT "deal_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "foundation"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal" ADD CONSTRAINT "deal_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "foundation"."opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal" ADD CONSTRAINT "deal_deal_state_id_fkey" FOREIGN KEY ("deal_state_id") REFERENCES "foundation"."deal_state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task" ADD CONSTRAINT "task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "foundation"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task" ADD CONSTRAINT "task_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "foundation"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task" ADD CONSTRAINT "task_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "foundation"."deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task" ADD CONSTRAINT "task_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "foundation"."task_priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task" ADD CONSTRAINT "task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "foundation"."task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task_subscriber" ADD CONSTRAINT "task_subscriber_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "foundation"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task_subscriber" ADD CONSTRAINT "task_subscriber_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "foundation"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task_event" ADD CONSTRAINT "task_event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "foundation"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."task_event" ADD CONSTRAINT "task_event_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "foundation"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."property" ADD CONSTRAINT "property_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "foundation"."deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal_user" ADD CONSTRAINT "deal_user_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "foundation"."deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal_user" ADD CONSTRAINT "deal_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "foundation"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."business_user" ADD CONSTRAINT "business_user_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "foundation"."business"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."business_user" ADD CONSTRAINT "business_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "foundation"."user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."deal_event" ADD CONSTRAINT "deal_event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "foundation"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foundation"."deal_event" ADD CONSTRAINT "deal_event_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "foundation"."deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
