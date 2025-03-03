/*
  Warnings:

  - The primary key for the `link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `role_link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[configuration_schema,source_view_name,source_column_name,target_view_name,target_column_name,junction_view_name]` on the table `link` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[configuration_schema,source_view_name,source_column_name,target_view_name,target_column_name,junction_view_name]` on the table `role_link` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "configuration"."link" DROP CONSTRAINT "link_pkey",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "link_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "configuration"."role_link" DROP CONSTRAINT "role_link_pkey",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "role_link_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "link_configuration_schema_source_view_name_source_column_na_key" ON "configuration"."link"("configuration_schema", "source_view_name", "source_column_name", "target_view_name", "target_column_name", "junction_view_name");

-- CreateIndex
CREATE INDEX "role_link_configuration_schema_source_view_name_idx" ON "configuration"."role_link"("configuration_schema", "source_view_name");

-- CreateIndex
CREATE UNIQUE INDEX "role_link_configuration_schema_source_view_name_source_colu_key" ON "configuration"."role_link"("configuration_schema", "source_view_name", "source_column_name", "target_view_name", "target_column_name", "junction_view_name");
