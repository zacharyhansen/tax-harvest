import type { Database } from '~/lib/database/database.types';
// TODO: This while file is repeated in app/api so the FE can have access to the recursive types
// DOnt have time right now to figure out the importingissue of utls into nestjs

// Outputs
export interface DataviewOutput {
  id: string;
  dataset_id: string;
  role_view_name: string;
  constraint: string;
  configuration_schema: Database['auth']['Enums']['schema'];
  created_by_id: string;
  dataview_column: DataviewColumnOuput[] | null;
  role_view: {
    name: string;
    role_name: string;
    view_name: string;
    pgt_deletable: boolean;
    pgt_description: string | null;
    pgt_insertable: boolean;
    pgt_is_view: boolean;
    pgt_updatable: boolean;
    pgt_pk_cols: string[] | null;
  };
}

export interface DataviewColumnOuput {
  id: string;
  role_column_name: string;
  role_view_name: string;
  configuration_schema: Database['auth']['Enums']['schema'];
  parent_dataview_id: string;
  child_dataview_id: string | null;
  label: string | null;
  description: string | null;
  order: number;
  input_type: Database['configuration']['Enums']['input_type'];
  ag_pinned: Database['configuration']['Enums']['ag_pinned'] | null;
  ag_width: number;
  ag_min_width: number;
  ag_flex: number | null;
  ag_editable: boolean;
  ag_resizable: boolean;
  hidden: boolean;
  child_dataview: DataviewOutput | null;
}

export interface DatasetOutput {
  id: string;
  configuration_schema: Database['auth']['Enums']['schema'];
  query: string;
  dataview_id: string | null;
  dataview: DataviewOutput | null;
  dataset_link_filter: {
    dataset_id: string;
    dataset_version_number: number;
    source_view_name: string;
    source_column_name: string;
    target_view_name: string;
    target_column_name: string;
    configuration_schema: Database['auth']['Enums']['schema'];
    dataview_column_id: string;
    path: string;
  }[];
  roleViews: string[] | null; // API adds this
}
