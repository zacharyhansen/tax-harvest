export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  auth: {
    Tables: {
      auth_user: {
        Row: {
          clerk_id: string;
          created_at: string;
          email: string;
          name: string | null;
        };
        Insert: {
          clerk_id: string;
          created_at?: string;
          email: string;
          name?: string | null;
        };
        Update: {
          clerk_id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      business_unit: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          tenant: Database['auth']['Enums']['tenant'];
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          tenant: Database['auth']['Enums']['tenant'];
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          tenant?: Database['auth']['Enums']['tenant'];
        };
        Relationships: [];
      };
      environment: {
        Row: {
          clerk_id: string;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          env: Database['auth']['Enums']['env'];
          external_id: string | null;
          name: string;
          schema: Database['auth']['Enums']['schema'];
          tenant: Database['auth']['Enums']['tenant'];
          updated_at: string;
        };
        Insert: {
          clerk_id: string;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          env?: Database['auth']['Enums']['env'];
          external_id?: string | null;
          name: string;
          schema: Database['auth']['Enums']['schema'];
          tenant: Database['auth']['Enums']['tenant'];
          updated_at?: string;
        };
        Update: {
          clerk_id?: string;
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          env?: Database['auth']['Enums']['env'];
          external_id?: string | null;
          name?: string;
          schema?: Database['auth']['Enums']['schema'];
          tenant?: Database['auth']['Enums']['tenant'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'environment_configuration_schema_fkey';
            columns: ['configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'business_unit';
            referencedColumns: ['configuration_schema'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      env: 'uat' | 'prod';
      schema: 'foundation';
      tenant: 'foundation_tenant';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  configuration: {
    Tables: {
      column: {
        Row: {
          column_id: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          data_type: Database['configuration']['Enums']['supported_pg_data_type'];
          default_input_type: Database['configuration']['Enums']['input_type'];
          is_pk: boolean;
          is_unique: boolean;
          is_updatable: boolean;
          name: string;
          oid: number;
          pg_column: string | null;
          pg_table: string | null;
          pgt_default: string | null;
          pgt_description: string | null;
          pgt_enum: string[] | null;
          pgt_max_len: number | null;
          pgt_name: string | null;
          pgt_nominal_type: string | null;
          pgt_nullable: boolean;
          pgt_type: string;
          table_id: number;
          updated_at: string;
          view_name: string;
        };
        Insert: {
          column_id: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          data_type: Database['configuration']['Enums']['supported_pg_data_type'];
          default_input_type: Database['configuration']['Enums']['input_type'];
          is_pk?: boolean;
          is_unique?: boolean;
          is_updatable?: boolean;
          name: string;
          oid: number;
          pg_column?: string | null;
          pg_table?: string | null;
          pgt_default?: string | null;
          pgt_description?: string | null;
          pgt_enum?: string[] | null;
          pgt_max_len?: number | null;
          pgt_name?: string | null;
          pgt_nominal_type?: string | null;
          pgt_nullable: boolean;
          pgt_type: string;
          table_id: number;
          updated_at?: string;
          view_name: string;
        };
        Update: {
          column_id?: number;
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          data_type?: Database['configuration']['Enums']['supported_pg_data_type'];
          default_input_type?: Database['configuration']['Enums']['input_type'];
          is_pk?: boolean;
          is_unique?: boolean;
          is_updatable?: boolean;
          name?: string;
          oid?: number;
          pg_column?: string | null;
          pg_table?: string | null;
          pgt_default?: string | null;
          pgt_description?: string | null;
          pgt_enum?: string[] | null;
          pgt_max_len?: number | null;
          pgt_name?: string | null;
          pgt_nominal_type?: string | null;
          pgt_nullable?: boolean;
          pgt_type?: string;
          table_id?: number;
          updated_at?: string;
          view_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
        ];
      };
      component: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          created_by_id: string;
          description: string | null;
          id: string;
          label: string;
          role_name: string;
          type: Database['configuration']['Enums']['component_type'];
          updated_at: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          created_by_id: string;
          description?: string | null;
          id?: string;
          label: string;
          role_name: string;
          type: Database['configuration']['Enums']['component_type'];
          updated_at?: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          created_by_id?: string;
          description?: string | null;
          id?: string;
          label?: string;
          role_name?: string;
          type?: Database['configuration']['Enums']['component_type'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'component_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
      component_version: {
        Row: {
          component_id: string;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          created_by_id: string;
          form_id: string | null;
          layout_id: string | null;
          role_name: string;
          slug: string | null;
          table_id: string | null;
          type: Database['configuration']['Enums']['component_type'];
          updated_at: string;
          version: number;
        };
        Insert: {
          component_id: string;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          created_by_id: string;
          form_id?: string | null;
          layout_id?: string | null;
          role_name: string;
          slug?: string | null;
          table_id?: string | null;
          type: Database['configuration']['Enums']['component_type'];
          updated_at?: string;
          version: number;
        };
        Update: {
          component_id?: string;
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          created_by_id?: string;
          form_id?: string | null;
          layout_id?: string | null;
          role_name?: string;
          slug?: string | null;
          table_id?: string | null;
          type?: Database['configuration']['Enums']['component_type'];
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'component_version_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_version_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_version_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'component_version_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'component_version_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: true;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: true;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: true;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: true;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_table_id_fkey';
            columns: ['table_id'];
            isOneToOne: true;
            referencedRelation: 'table';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_table_id_fkey';
            columns: ['table_id'];
            isOneToOne: true;
            referencedRelation: 'table';
            referencedColumns: ['id'];
          },
        ];
      };
      dataset: {
        Row: {
          cached: Json | null;
          configuration_schema: Database['auth']['Enums']['schema'];
          dataview_id: string | null;
          id: string;
          query: string;
        };
        Insert: {
          cached?: Json | null;
          configuration_schema: Database['auth']['Enums']['schema'];
          dataview_id?: string | null;
          id?: string;
          query?: string;
        };
        Update: {
          cached?: Json | null;
          configuration_schema?: Database['auth']['Enums']['schema'];
          dataview_id?: string | null;
          id?: string;
          query?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dataset_dataview_id_fkey';
            columns: ['dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_dataview_id_fkey';
            columns: ['dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
        ];
      };
      dataset_link_filter: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          dataset_id: string;
          dataview_column_id: string;
          path: string;
          source_column_name: string;
          source_view_name: string;
          target_column_name: string;
          target_view_name: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          dataset_id: string;
          dataview_column_id: string;
          path: string;
          source_column_name: string;
          source_view_name: string;
          target_column_name: string;
          target_view_name: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          dataset_id?: string;
          dataview_column_id?: string;
          path?: string;
          source_column_name?: string;
          source_view_name?: string;
          target_column_name?: string;
          target_view_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dataset_link_filter_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_dataview_column_id_fkey';
            columns: ['dataview_column_id'];
            isOneToOne: false;
            referencedRelation: 'dataview_column';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_dataview_column_id_fkey';
            columns: ['dataview_column_id'];
            isOneToOne: false;
            referencedRelation: 'dataview_column';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_source_view_name_configuration_schema_fkey';
            columns: ['source_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'dataset_link_filter_source_view_name_configuration_schema_fkey';
            columns: ['source_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'dataset_link_filter_target_view_name_configuration_schema_fkey';
            columns: ['target_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'dataset_link_filter_target_view_name_configuration_schema_fkey';
            columns: ['target_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
        ];
      };
      dataview: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          constraint: string;
          dataset_id: string;
          id: string;
          role_view_name: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          constraint: string;
          dataset_id: string;
          id?: string;
          role_view_name: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          constraint?: string;
          dataset_id?: string;
          id?: string;
          role_view_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dataview_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'dataview_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'dataview_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
        ];
      };
      dataview_column: {
        Row: {
          ag_editable: boolean;
          ag_flex: number | null;
          ag_min_width: number;
          ag_pinned: Database['configuration']['Enums']['ag_pinned'] | null;
          ag_resizable: boolean;
          ag_width: number;
          child_dataview_id: string | null;
          configuration_schema: Database['auth']['Enums']['schema'];
          description: string | null;
          header_group: string | null;
          hidden: boolean;
          id: string;
          input_type: Database['configuration']['Enums']['input_type'];
          label: string | null;
          order: number;
          parent_dataview_id: string;
          role_column_name: string;
          role_view_name: string;
        };
        Insert: {
          ag_editable?: boolean;
          ag_flex?: number | null;
          ag_min_width?: number;
          ag_pinned?: Database['configuration']['Enums']['ag_pinned'] | null;
          ag_resizable?: boolean;
          ag_width?: number;
          child_dataview_id?: string | null;
          configuration_schema: Database['auth']['Enums']['schema'];
          description?: string | null;
          header_group?: string | null;
          hidden?: boolean;
          id?: string;
          input_type?: Database['configuration']['Enums']['input_type'];
          label?: string | null;
          order?: number;
          parent_dataview_id: string;
          role_column_name: string;
          role_view_name: string;
        };
        Update: {
          ag_editable?: boolean;
          ag_flex?: number | null;
          ag_min_width?: number;
          ag_pinned?: Database['configuration']['Enums']['ag_pinned'] | null;
          ag_resizable?: boolean;
          ag_width?: number;
          child_dataview_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'];
          description?: string | null;
          header_group?: string | null;
          hidden?: boolean;
          id?: string;
          input_type?: Database['configuration']['Enums']['input_type'];
          label?: string | null;
          order?: number;
          parent_dataview_id?: string;
          role_column_name?: string;
          role_view_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dataview_column_child_dataview_id_fkey';
            columns: ['child_dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_column_child_dataview_id_fkey';
            columns: ['child_dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_column_configuration_schema_role_view_name_role_c_fkey';
            columns: [
              'configuration_schema',
              'role_view_name',
              'role_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'dataview_column_configuration_schema_role_view_name_role_c_fkey';
            columns: [
              'configuration_schema',
              'role_view_name',
              'role_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'dataview_column_parent_dataview_id_fkey';
            columns: ['parent_dataview_id'];
            isOneToOne: false;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_column_parent_dataview_id_fkey';
            columns: ['parent_dataview_id'];
            isOneToOne: false;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
        ];
      };
      field: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          default_value: string | null;
          description: string | null;
          form_id: string;
          input_type: Database['configuration']['Enums']['input_type'];
          label: string | null;
          name: string;
          name_locked: boolean;
          options: Json;
          placeholder: string | null;
          required: boolean;
          section_id: string;
          updated_at: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          default_value?: string | null;
          description?: string | null;
          form_id: string;
          input_type: Database['configuration']['Enums']['input_type'];
          label?: string | null;
          name: string;
          name_locked?: boolean;
          options?: Json;
          placeholder?: string | null;
          required?: boolean;
          section_id: string;
          updated_at?: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          default_value?: string | null;
          description?: string | null;
          form_id?: string;
          input_type?: Database['configuration']['Enums']['input_type'];
          label?: string | null;
          name?: string;
          name_locked?: boolean;
          options?: Json;
          placeholder?: string | null;
          required?: boolean;
          section_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'field_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'field_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'field_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'field_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
        ];
      };
      form: {
        Row: {
          columns: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          dataset_id: string;
          form_section_id: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          columns?: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          dataset_id: string;
          form_section_id?: string | null;
          id?: string;
          updated_at?: string;
        };
        Update: {
          columns?: number;
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          dataset_id?: string;
          form_section_id?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'form_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_form_section_id_fkey';
            columns: ['form_section_id'];
            isOneToOne: true;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_form_section_id_fkey';
            columns: ['form_section_id'];
            isOneToOne: true;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
        ];
      };
      form_instance: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          content: string;
          created_at: string;
          created_by_id: string;
          form_id: string;
          id: string;
          updated_at: string;
          values: Json;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          content?: string;
          created_at?: string;
          created_by_id: string;
          form_id: string;
          id?: string;
          updated_at?: string;
          values?: Json;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          content?: string;
          created_at?: string;
          created_by_id?: string;
          form_id?: string;
          id?: string;
          updated_at?: string;
          values?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'form_instance_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'form_instance_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'form_instance_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_instance_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
        ];
      };
      form_section: {
        Row: {
          border: boolean;
          columns: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          description: string | null;
          form_id: string;
          id: string;
          is_repeated: boolean;
          label: string | null;
          order: number;
          parent_section_id: string | null;
        };
        Insert: {
          border?: boolean;
          columns?: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          description?: string | null;
          form_id: string;
          id?: string;
          is_repeated?: boolean;
          label?: string | null;
          order?: number;
          parent_section_id?: string | null;
        };
        Update: {
          border?: boolean;
          columns?: number;
          configuration_schema?: Database['auth']['Enums']['schema'];
          description?: string | null;
          form_id?: string;
          id?: string;
          is_repeated?: boolean;
          label?: string | null;
          order?: number;
          parent_section_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_section_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_section_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_section_parent_section_id_fkey';
            columns: ['parent_section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_section_parent_section_id_fkey';
            columns: ['parent_section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
        ];
      };
      layout: {
        Row: {
          columns: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          description: string | null;
          id: string;
          label: string | null;
          rows: number;
          slug: string;
          updated_at: string;
        };
        Insert: {
          columns?: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          description?: string | null;
          id?: string;
          label?: string | null;
          rows?: number;
          slug: string;
          updated_at?: string;
        };
        Update: {
          columns?: number;
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          description?: string | null;
          id?: string;
          label?: string | null;
          rows?: number;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      link: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          constraint: string;
          constraint_2: string | null;
          display_name: string;
          id: string;
          junction_source_column_name: string | null;
          junction_target_column_name: string | null;
          junction_view_name: string | null;
          pgt_columns: string[] | null;
          pgt_columns_2: string[] | null;
          pgt_is_self: boolean;
          source_column_name: string;
          source_view_name: string;
          target_column_name: string;
          target_view_name: string;
          type: Database['configuration']['Enums']['link_type'];
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          constraint: string;
          constraint_2?: string | null;
          display_name: string;
          id?: string;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self: boolean;
          source_column_name: string;
          source_view_name: string;
          target_column_name: string;
          target_view_name: string;
          type: Database['configuration']['Enums']['link_type'];
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          constraint?: string;
          constraint_2?: string | null;
          display_name?: string;
          id?: string;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self?: boolean;
          source_column_name?: string;
          source_view_name?: string;
          target_column_name?: string;
          target_view_name?: string;
          type?: Database['configuration']['Enums']['link_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_sour_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_sour_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_sour_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_targ_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_targ_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_targ_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_source_column_n_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_source_column_n_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_source_column_n_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_target_column_n_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_target_column_n_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_target_column_n_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
        ];
      };
      published_component: {
        Row: {
          component_id: string;
          configuration_schema: Database['auth']['Enums']['schema'];
          environment_schema: Database['auth']['Enums']['schema'];
          id: string;
          published_at: string | null;
          published_by_id: string | null;
          role_name: string;
          slug: string | null;
          version: number;
        };
        Insert: {
          component_id: string;
          configuration_schema: Database['auth']['Enums']['schema'];
          environment_schema: Database['auth']['Enums']['schema'];
          id?: string;
          published_at?: string | null;
          published_by_id?: string | null;
          role_name: string;
          slug?: string | null;
          version: number;
        };
        Update: {
          component_id?: string;
          configuration_schema?: Database['auth']['Enums']['schema'];
          environment_schema?: Database['auth']['Enums']['schema'];
          id?: string;
          published_at?: string | null;
          published_by_id?: string | null;
          role_name?: string;
          slug?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'published_component_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_component_id_version_fkey';
            columns: ['component_id', 'version'];
            isOneToOne: false;
            referencedRelation: 'component_version';
            referencedColumns: ['component_id', 'version'];
          },
          {
            foreignKeyName: 'published_component_component_id_version_fkey';
            columns: ['component_id', 'version'];
            isOneToOne: false;
            referencedRelation: 'component_version';
            referencedColumns: ['component_id', 'version'];
          },
          {
            foreignKeyName: 'published_component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'published_component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'published_component_environment_schema_fkey';
            columns: ['environment_schema'];
            isOneToOne: false;
            referencedRelation: 'environment';
            referencedColumns: ['schema'];
          },
          {
            foreignKeyName: 'published_component_environment_schema_fkey';
            columns: ['environment_schema'];
            isOneToOne: false;
            referencedRelation: 'environment';
            referencedColumns: ['schema'];
          },
          {
            foreignKeyName: 'published_component_published_by_id_fkey';
            columns: ['published_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'published_component_published_by_id_fkey';
            columns: ['published_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
      published_component_on_widget: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          id: string;
          order: number;
          published_component_id: string;
          widget_id: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          id?: string;
          order?: number;
          published_component_id: string;
          widget_id: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          id?: string;
          order?: number;
          published_component_id?: string;
          widget_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'published_component_on_widget_published_component_id_fkey';
            columns: ['published_component_id'];
            isOneToOne: false;
            referencedRelation: 'published_component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_on_widget_published_component_id_fkey';
            columns: ['published_component_id'];
            isOneToOne: false;
            referencedRelation: 'published_component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_on_widget_widget_id_fkey';
            columns: ['widget_id'];
            isOneToOne: false;
            referencedRelation: 'widget';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_on_widget_widget_id_fkey';
            columns: ['widget_id'];
            isOneToOne: false;
            referencedRelation: 'widget';
            referencedColumns: ['id'];
          },
        ];
      };
      role: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          name: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          name: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          name?: string;
        };
        Relationships: [];
      };
      role_column: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          name: string;
          role_view_name: string;
          view_name: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          name: string;
          role_view_name: string;
          view_name: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          name?: string;
          role_view_name?: string;
          view_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_column_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_name_fkey';
            columns: ['configuration_schema', 'view_name', 'name'];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_name_fkey';
            columns: ['configuration_schema', 'view_name', 'name'];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_name_fkey';
            columns: ['configuration_schema', 'view_name', 'name'];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
        ];
      };
      role_link: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          constraint: string;
          constraint_2: string | null;
          display_name: string;
          id: string;
          junction_source_column_name: string | null;
          junction_target_column_name: string | null;
          junction_view_name: string | null;
          pgt_columns: string[] | null;
          pgt_columns_2: string[] | null;
          pgt_is_self: boolean;
          source_column_name: string;
          source_view_name: string;
          target_column_name: string;
          target_view_name: string;
          type: Database['configuration']['Enums']['link_type'];
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          constraint: string;
          constraint_2?: string | null;
          display_name: string;
          id?: string;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self: boolean;
          source_column_name: string;
          source_view_name: string;
          target_column_name: string;
          target_view_name: string;
          type: Database['configuration']['Enums']['link_type'];
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          constraint?: string;
          constraint_2?: string | null;
          display_name?: string;
          id?: string;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self?: boolean;
          source_column_name?: string;
          source_view_name?: string;
          target_column_name?: string;
          target_view_name?: string;
          type?: Database['configuration']['Enums']['link_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'role_link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_source_col_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_source_col_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_target_col_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_target_col_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_source_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_source_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_target_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_target_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
        ];
      };
      role_view: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          name: string;
          pgt_deletable: boolean;
          pgt_description: string | null;
          pgt_insertable: boolean;
          pgt_is_view: boolean;
          pgt_pk_cols: string[] | null;
          pgt_updatable: boolean;
          role_name: string;
          view_name: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          name: string;
          pgt_deletable: boolean;
          pgt_description?: string | null;
          pgt_insertable: boolean;
          pgt_is_view: boolean;
          pgt_pk_cols?: string[] | null;
          pgt_updatable: boolean;
          role_name: string;
          view_name: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          name?: string;
          pgt_deletable?: boolean;
          pgt_description?: string | null;
          pgt_insertable?: boolean;
          pgt_is_view?: boolean;
          pgt_pk_cols?: string[] | null;
          pgt_updatable?: boolean;
          role_name?: string;
          view_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_view_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_view_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_view_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_view_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
        ];
      };
      table: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          dataset_id: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          dataset_id: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          dataset_id?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'table_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'table_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
        ];
      };
      tile: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          default_open: boolean;
          description: string | null;
          grid_end: number;
          grid_start: number;
          height: number;
          id: string;
          label: string | null;
          layout_id: string;
          order: number;
          updated_at: string;
          width: number;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          default_open?: boolean;
          description?: string | null;
          grid_end?: number;
          grid_start?: number;
          height?: number;
          id?: string;
          label?: string | null;
          layout_id: string;
          order?: number;
          updated_at?: string;
          width?: number;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          default_open?: boolean;
          description?: string | null;
          grid_end?: number;
          grid_start?: number;
          height?: number;
          id?: string;
          label?: string | null;
          layout_id?: string;
          order?: number;
          updated_at?: string;
          width?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'tile_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: false;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tile_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: false;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
        ];
      };
      view: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          name: string;
          pg_primary_table: string | null;
          pgt_deletable: boolean;
          pgt_description: string | null;
          pgt_insertable: boolean;
          pgt_is_view: boolean;
          pgt_pk_cols: string[] | null;
          pgt_updatable: boolean;
          type: Database['configuration']['Enums']['view_type'];
          updated_at: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at?: string;
          name: string;
          pg_primary_table?: string | null;
          pgt_deletable: boolean;
          pgt_description?: string | null;
          pgt_insertable: boolean;
          pgt_is_view: boolean;
          pgt_pk_cols?: string[] | null;
          pgt_updatable: boolean;
          type: Database['configuration']['Enums']['view_type'];
          updated_at?: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          created_at?: string;
          name?: string;
          pg_primary_table?: string | null;
          pgt_deletable?: boolean;
          pgt_description?: string | null;
          pgt_insertable?: boolean;
          pgt_is_view?: boolean;
          pgt_pk_cols?: string[] | null;
          pgt_updatable?: boolean;
          type?: Database['configuration']['Enums']['view_type'];
          updated_at?: string;
        };
        Relationships: [];
      };
      widget: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'];
          description: string | null;
          id: string;
          label: string;
          order: number;
          tile_id: string;
        };
        Insert: {
          configuration_schema: Database['auth']['Enums']['schema'];
          description?: string | null;
          id?: string;
          label: string;
          order?: number;
          tile_id: string;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'];
          description?: string | null;
          id?: string;
          label?: string;
          order?: number;
          tile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'widget_tile_id_fkey';
            columns: ['tile_id'];
            isOneToOne: false;
            referencedRelation: 'tile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'widget_tile_id_fkey';
            columns: ['tile_id'];
            isOneToOne: false;
            referencedRelation: 'tile';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_config_schema_for_schema: {
        Args: {
          p_schema: Database['auth']['Enums']['schema'];
        };
        Returns: Database['auth']['Enums']['schema'];
      };
    };
    Enums: {
      ag_pinned: 'left' | 'right';
      component_type: 'form' | 'table' | 'layout';
      input_type:
        | 'text'
        | 'phone'
        | 'password'
        | 'textarea'
        | 'number'
        | 'percentage'
        | 'usd'
        | 'combobox'
        | 'combobox_multi'
        | 'date'
        | 'timestamp'
        | 'checkbox'
        | 'switch'
        | 'tiptap'
        | 'slider'
        | 'user';
      link_type: 'M2O' | 'O2M' | 'M2M' | 'O2O';
      supported_pg_data_type:
        | 'unknown'
        | 'array_integer'
        | 'array_json'
        | 'array_jsonb'
        | 'array_text'
        | 'array_boolean'
        | 'array_numeric'
        | 'array_varchar'
        | 'array_date'
        | 'array_timestamp'
        | 'bigint'
        | 'bigserial'
        | 'bit'
        | 'bit_varying'
        | 'boolean'
        | 'box'
        | 'bytea'
        | 'character'
        | 'character_varying'
        | 'cidr'
        | 'circle'
        | 'date'
        | 'double_precision'
        | 'enum'
        | 'float4'
        | 'float8'
        | 'inet'
        | 'integer'
        | 'interval'
        | 'json'
        | 'jsonb'
        | 'line'
        | 'lseg'
        | 'macaddr'
        | 'money'
        | 'numeric'
        | 'path'
        | 'point'
        | 'polygon'
        | 'real'
        | 'serial'
        | 'smallint'
        | 'smallserial'
        | 'text'
        | 'time'
        | 'time_with_time_zone'
        | 'timestamp'
        | 'timestamp_with_time_zone'
        | 'timestamp_without_time_zone'
        | 'tsquery'
        | 'tsvector'
        | 'txid_snapshot'
        | 'uuid'
        | 'xml';
      view_type: 'product' | 'custom';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  foundation: {
    Tables: {
      business: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          business_type: string | null;
          city: string | null;
          county: string | null;
          created_at: string;
          date_business_began: string | null;
          dba: string | null;
          debt: number | null;
          duns: string | null;
          email: string | null;
          external_id: string | null;
          id: string;
          industry: string | null;
          name_display: string | null;
          name_legal: string | null;
          phone: string | null;
          revenue_average: number | null;
          state: Database['public']['Enums']['state_usa'] | null;
          tin: string | null;
          updated_at: string;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          business_type?: string | null;
          city?: string | null;
          county?: string | null;
          created_at?: string;
          date_business_began?: string | null;
          dba?: string | null;
          debt?: number | null;
          duns?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: string;
          industry?: string | null;
          name_display?: string | null;
          name_legal?: string | null;
          phone?: string | null;
          revenue_average?: number | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tin?: string | null;
          updated_at: string;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          business_type?: string | null;
          city?: string | null;
          county?: string | null;
          created_at?: string;
          date_business_began?: string | null;
          dba?: string | null;
          debt?: number | null;
          duns?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: string;
          industry?: string | null;
          name_display?: string | null;
          name_legal?: string | null;
          phone?: string | null;
          revenue_average?: number | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tin?: string | null;
          updated_at?: string;
          zip?: string | null;
        };
        Relationships: [];
      };
      business_user: {
        Row: {
          business_id: string;
          created_at: string;
          expense_average_monthly: number | null;
          id: string;
          income_average_monthly: number | null;
          job_title: string | null;
          owernship: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          expense_average_monthly?: number | null;
          id?: string;
          income_average_monthly?: number | null;
          job_title?: string | null;
          owernship?: number | null;
          updated_at: string;
          user_id: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          expense_average_monthly?: number | null;
          id?: string;
          income_average_monthly?: number | null;
          job_title?: string | null;
          owernship?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
        ];
      };
      deal: {
        Row: {
          appetite: number | null;
          created_at: string;
          created_by_id: string;
          deal_state_id: string;
          external_id: string | null;
          id: string;
          interest_rate: number | null;
          label: string;
          loan_amount: number | null;
          loan_processing_fee: number | null;
          opportunity_id: string;
          source: string | null;
          ssbs_score: number | null;
          updated_at: string;
          winnability: number | null;
        };
        Insert: {
          appetite?: number | null;
          created_at?: string;
          created_by_id: string;
          deal_state_id: string;
          external_id?: string | null;
          id?: string;
          interest_rate?: number | null;
          label: string;
          loan_amount?: number | null;
          loan_processing_fee?: number | null;
          opportunity_id: string;
          source?: string | null;
          ssbs_score?: number | null;
          updated_at: string;
          winnability?: number | null;
        };
        Update: {
          appetite?: number | null;
          created_at?: string;
          created_by_id?: string;
          deal_state_id?: string;
          external_id?: string | null;
          id?: string;
          interest_rate?: number | null;
          label?: string;
          loan_amount?: number | null;
          loan_processing_fee?: number | null;
          opportunity_id?: string;
          source?: string | null;
          ssbs_score?: number | null;
          updated_at?: string;
          winnability?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal_state';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal_state__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: 'deal_state';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: '_p_opportunity';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: '_p_opportunity__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: 'opportunity';
            referencedColumns: ['id'];
          },
        ];
      };
      deal_assignee: {
        Row: {
          deal_id: string;
          user_id: string;
        };
        Insert: {
          deal_id: string;
          user_id: string;
        };
        Update: {
          deal_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
        ];
      };
      deal_event: {
        Row: {
          created_by: string;
          deal_id: string;
          id: number;
          message: string;
          metadata: Json | null;
          source: string | null;
          timestamp: string;
          type: Database['public']['Enums']['deal_event_type'];
        };
        Insert: {
          created_by: string;
          deal_id: string;
          id?: number;
          message: string;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string;
          type?: Database['public']['Enums']['deal_event_type'];
        };
        Update: {
          created_by?: string;
          deal_id?: string;
          id?: number;
          message?: string;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string;
          type?: Database['public']['Enums']['deal_event_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
        ];
      };
      deal_state: {
        Row: {
          created_at: string;
          external_id: string | null;
          id: string;
          label: string;
          order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          external_id?: string | null;
          id?: string;
          label: string;
          order: number;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          external_id?: string | null;
          id?: string;
          label?: string;
          order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      deal_user: {
        Row: {
          created_at: string;
          deal_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deal_id: string;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deal_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
        ];
      };
      opportunity: {
        Row: {
          active_deal_id: string | null;
          agent_id: string | null;
          borrower_business_id: string | null;
          borrower_user_id: string | null;
          created_at: string;
          created_by_id: string;
          external_id: string | null;
          id: string;
          label: string | null;
          updated_at: string;
        };
        Insert: {
          active_deal_id?: string | null;
          agent_id?: string | null;
          borrower_business_id?: string | null;
          borrower_user_id?: string | null;
          created_at?: string;
          created_by_id: string;
          external_id?: string | null;
          id?: string;
          label?: string | null;
          updated_at: string;
        };
        Update: {
          active_deal_id?: string | null;
          agent_id?: string | null;
          borrower_business_id?: string | null;
          borrower_user_id?: string | null;
          created_at?: string;
          created_by_id?: string;
          external_id?: string | null;
          id?: string;
          label?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: 'business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
        ];
      };
      property: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          amenities: string[] | null;
          area_sq_km: number | null;
          building_type: Database['public']['Enums']['building_type'] | null;
          city: string | null;
          county: string | null;
          created_at: string;
          deal_id: string;
          description: string | null;
          external_id: string | null;
          id: string;
          last_census_at: string | null;
          state: Database['public']['Enums']['state_usa'] | null;
          tags: string[] | null;
          type: Database['public']['Enums']['property_type'] | null;
          updated_at: string;
          year_built: number | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          amenities?: string[] | null;
          area_sq_km?: number | null;
          building_type?: Database['public']['Enums']['building_type'] | null;
          city?: string | null;
          county?: string | null;
          created_at?: string;
          deal_id: string;
          description?: string | null;
          external_id?: string | null;
          id?: string;
          last_census_at?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tags?: string[] | null;
          type?: Database['public']['Enums']['property_type'] | null;
          updated_at: string;
          year_built?: number | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          amenities?: string[] | null;
          area_sq_km?: number | null;
          building_type?: Database['public']['Enums']['building_type'] | null;
          city?: string | null;
          county?: string | null;
          created_at?: string;
          deal_id?: string;
          description?: string | null;
          external_id?: string | null;
          id?: string;
          last_census_at?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tags?: string[] | null;
          type?: Database['public']['Enums']['property_type'] | null;
          updated_at?: string;
          year_built?: number | null;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
        ];
      };
      task: {
        Row: {
          assignee_id: string | null;
          created_at: string;
          created_by_id: string;
          deal_id: string | null;
          description: string | null;
          external_id: string | null;
          id: string;
          priority_id: number;
          status_id: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          assignee_id?: string | null;
          created_at?: string;
          created_by_id: string;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string;
          priority_id: number;
          status_id: number;
          title: string;
          updated_at: string;
        };
        Update: {
          assignee_id?: string | null;
          created_at?: string;
          created_by_id?: string;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string;
          priority_id?: number;
          status_id?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_priority';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_priority__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: 'task_priority';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_status__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: 'task_status';
            referencedColumns: ['id'];
          },
        ];
      };
      task_event: {
        Row: {
          comment: string | null;
          created_by: string;
          id: number;
          metadata: Json | null;
          source: string | null;
          task_id: string;
          timestamp: string;
        };
        Insert: {
          comment?: string | null;
          created_by: string;
          id?: number;
          metadata?: Json | null;
          source?: string | null;
          task_id: string;
          timestamp?: string;
        };
        Update: {
          comment?: string | null;
          created_by?: string;
          id?: number;
          metadata?: Json | null;
          source?: string | null;
          task_id?: string;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'task';
            referencedColumns: ['id'];
          },
        ];
      };
      task_priority: {
        Row: {
          created_at: string;
          external_id: string | null;
          id: number;
          label: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          external_id?: string | null;
          id?: number;
          label: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          external_id?: string | null;
          id?: number;
          label?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      task_status: {
        Row: {
          created_at: string;
          external_id: string | null;
          id: number;
          label: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          external_id?: string | null;
          id?: number;
          label: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          external_id?: string | null;
          id?: number;
          label?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      task_subscriber: {
        Row: {
          task_id: string;
          user_id: string;
        };
        Insert: {
          task_id: string;
          user_id: string;
        };
        Update: {
          task_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
        ];
      };
      user: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          city: string | null;
          configuration_schema: Database['auth']['Enums']['schema'];
          county: string | null;
          created_at: string;
          credit_score: number | null;
          date_of_birth: string | null;
          email: string;
          external_id: string | null;
          name: string | null;
          phone: string | null;
          role_name: string;
          ssn: string | null;
          state: Database['public']['Enums']['state_usa'] | null;
          updated_at: string;
          user_id: string;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          configuration_schema: Database['auth']['Enums']['schema'];
          county?: string | null;
          created_at?: string;
          credit_score?: number | null;
          date_of_birth?: string | null;
          email: string;
          external_id?: string | null;
          name?: string | null;
          phone?: string | null;
          role_name: string;
          ssn?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          updated_at: string;
          user_id: string;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'];
          county?: string | null;
          created_at?: string;
          credit_score?: number | null;
          date_of_birth?: string | null;
          email?: string;
          external_id?: string | null;
          name?: string | null;
          phone?: string | null;
          role_name?: string;
          ssn?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          updated_at?: string;
          user_id?: string;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_role_name_configuration_schema_fkey';
            columns: ['role_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'user_role_name_configuration_schema_fkey';
            columns: ['role_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
    };
    Views: {
      _p_business: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          business_type: string | null;
          city: string | null;
          county: string | null;
          created_at: string | null;
          date_business_began: string | null;
          dba: string | null;
          debt: number | null;
          duns: string | null;
          email: string | null;
          external_id: string | null;
          id: string | null;
          industry: string | null;
          name_display: string | null;
          name_legal: string | null;
          phone: string | null;
          revenue_average: number | null;
          state: Database['public']['Enums']['state_usa'] | null;
          tin: string | null;
          updated_at: string | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          business_type?: string | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          date_business_began?: string | null;
          dba?: string | null;
          debt?: number | null;
          duns?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: string | null;
          industry?: string | null;
          name_display?: string | null;
          name_legal?: string | null;
          phone?: string | null;
          revenue_average?: number | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tin?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          business_type?: string | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          date_business_began?: string | null;
          dba?: string | null;
          debt?: number | null;
          duns?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: string | null;
          industry?: string | null;
          name_display?: string | null;
          name_legal?: string | null;
          phone?: string | null;
          revenue_average?: number | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tin?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      _p_business__admin: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          business_type: string | null;
          city: string | null;
          county: string | null;
          created_at: string | null;
          date_business_began: string | null;
          dba: string | null;
          debt: number | null;
          duns: string | null;
          email: string | null;
          external_id: string | null;
          id: string | null;
          industry: string | null;
          name_display: string | null;
          name_legal: string | null;
          phone: string | null;
          revenue_average: number | null;
          state: Database['public']['Enums']['state_usa'] | null;
          tin: string | null;
          updated_at: string | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          business_type?: string | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          date_business_began?: string | null;
          dba?: string | null;
          debt?: number | null;
          duns?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: string | null;
          industry?: string | null;
          name_display?: string | null;
          name_legal?: string | null;
          phone?: string | null;
          revenue_average?: number | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tin?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          business_type?: string | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          date_business_began?: string | null;
          dba?: string | null;
          debt?: number | null;
          duns?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: string | null;
          industry?: string | null;
          name_display?: string | null;
          name_legal?: string | null;
          phone?: string | null;
          revenue_average?: number | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tin?: string | null;
          updated_at?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      _p_business_user: {
        Row: {
          business_id: string | null;
          created_at: string | null;
          expense_average_monthly: number | null;
          id: string | null;
          income_average_monthly: number | null;
          job_title: string | null;
          owernship: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          business_id?: string | null;
          created_at?: string | null;
          expense_average_monthly?: number | null;
          id?: string | null;
          income_average_monthly?: number | null;
          job_title?: string | null;
          owernship?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          business_id?: string | null;
          created_at?: string | null;
          expense_average_monthly?: number | null;
          id?: string | null;
          income_average_monthly?: number | null;
          job_title?: string | null;
          owernship?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_business_user__admin: {
        Row: {
          business_id: string | null;
          created_at: string | null;
          expense_average_monthly: number | null;
          id: string | null;
          income_average_monthly: number | null;
          job_title: string | null;
          owernship: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          business_id?: string | null;
          created_at?: string | null;
          expense_average_monthly?: number | null;
          id?: string | null;
          income_average_monthly?: number | null;
          job_title?: string | null;
          owernship?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          business_id?: string | null;
          created_at?: string | null;
          expense_average_monthly?: number | null;
          id?: string | null;
          income_average_monthly?: number | null;
          job_title?: string | null;
          owernship?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'business_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_deal: {
        Row: {
          appetite: number | null;
          created_at: string | null;
          created_by_id: string | null;
          deal_state_id: string | null;
          external_id: string | null;
          id: string | null;
          interest_rate: number | null;
          label: string | null;
          loan_amount: number | null;
          loan_processing_fee: number | null;
          opportunity_id: string | null;
          source: string | null;
          ssbs_score: number | null;
          updated_at: string | null;
          winnability: number | null;
        };
        Insert: {
          appetite?: number | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_state_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          interest_rate?: number | null;
          label?: string | null;
          loan_amount?: number | null;
          loan_processing_fee?: number | null;
          opportunity_id?: string | null;
          source?: string | null;
          ssbs_score?: number | null;
          updated_at?: string | null;
          winnability?: number | null;
        };
        Update: {
          appetite?: number | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_state_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          interest_rate?: number | null;
          label?: string | null;
          loan_amount?: number | null;
          loan_processing_fee?: number | null;
          opportunity_id?: string | null;
          source?: string | null;
          ssbs_score?: number | null;
          updated_at?: string | null;
          winnability?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: 'deal_state';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal_state';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal_state__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: 'opportunity';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: '_p_opportunity';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: '_p_opportunity__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_deal__admin: {
        Row: {
          appetite: number | null;
          created_at: string | null;
          created_by_id: string | null;
          deal_state_id: string | null;
          external_id: string | null;
          id: string | null;
          interest_rate: number | null;
          label: string | null;
          loan_amount: number | null;
          loan_processing_fee: number | null;
          opportunity_id: string | null;
          source: string | null;
          ssbs_score: number | null;
          updated_at: string | null;
          winnability: number | null;
        };
        Insert: {
          appetite?: number | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_state_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          interest_rate?: number | null;
          label?: string | null;
          loan_amount?: number | null;
          loan_processing_fee?: number | null;
          opportunity_id?: string | null;
          source?: string | null;
          ssbs_score?: number | null;
          updated_at?: string | null;
          winnability?: number | null;
        };
        Update: {
          appetite?: number | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_state_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          interest_rate?: number | null;
          label?: string | null;
          loan_amount?: number | null;
          loan_processing_fee?: number | null;
          opportunity_id?: string | null;
          source?: string | null;
          ssbs_score?: number | null;
          updated_at?: string | null;
          winnability?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: 'deal_state';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal_state';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_deal_state_id_fkey';
            columns: ['deal_state_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal_state__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: 'opportunity';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: '_p_opportunity';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: '_p_opportunity__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_deal_assignee: {
        Row: {
          deal_id: string | null;
          user_id: string | null;
        };
        Insert: {
          deal_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          deal_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_deal_assignee__admin: {
        Row: {
          deal_id: string | null;
          user_id: string | null;
        };
        Insert: {
          deal_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          deal_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_assignee_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_deal_event: {
        Row: {
          created_by: string | null;
          deal_id: string | null;
          id: number | null;
          message: string | null;
          metadata: Json | null;
          source: string | null;
          timestamp: string | null;
          type: Database['public']['Enums']['deal_event_type'] | null;
        };
        Insert: {
          created_by?: string | null;
          deal_id?: string | null;
          id?: number | null;
          message?: string | null;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string | null;
          type?: Database['public']['Enums']['deal_event_type'] | null;
        };
        Update: {
          created_by?: string | null;
          deal_id?: string | null;
          id?: number | null;
          message?: string | null;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string | null;
          type?: Database['public']['Enums']['deal_event_type'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_deal_event__admin: {
        Row: {
          created_by: string | null;
          deal_id: string | null;
          id: number | null;
          message: string | null;
          metadata: Json | null;
          source: string | null;
          timestamp: string | null;
          type: Database['public']['Enums']['deal_event_type'] | null;
        };
        Insert: {
          created_by?: string | null;
          deal_id?: string | null;
          id?: number | null;
          message?: string | null;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string | null;
          type?: Database['public']['Enums']['deal_event_type'] | null;
        };
        Update: {
          created_by?: string | null;
          deal_id?: string | null;
          id?: number | null;
          message?: string | null;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string | null;
          type?: Database['public']['Enums']['deal_event_type'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_event_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_deal_state: {
        Row: {
          created_at: string | null;
          external_id: string | null;
          id: string | null;
          label: string | null;
          order: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      _p_deal_state__admin: {
        Row: {
          created_at: string | null;
          external_id: string | null;
          id: string | null;
          label: string | null;
          order: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      _p_deal_user: {
        Row: {
          created_at: string | null;
          deal_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          deal_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          deal_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_deal_user__admin: {
        Row: {
          created_at: string | null;
          deal_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          deal_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          deal_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'deal_user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_opportunity: {
        Row: {
          active_deal_id: string | null;
          agent_id: string | null;
          borrower_business_id: string | null;
          borrower_user_id: string | null;
          created_at: string | null;
          created_by_id: string | null;
          external_id: string | null;
          id: string | null;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          active_deal_id?: string | null;
          agent_id?: string | null;
          borrower_business_id?: string | null;
          borrower_user_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          active_deal_id?: string | null;
          agent_id?: string | null;
          borrower_business_id?: string | null;
          borrower_user_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: 'business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_opportunity__admin: {
        Row: {
          active_deal_id: string | null;
          agent_id: string | null;
          borrower_business_id: string | null;
          borrower_user_id: string | null;
          created_at: string | null;
          created_by_id: string | null;
          external_id: string | null;
          id: string | null;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          active_deal_id?: string | null;
          agent_id?: string | null;
          borrower_business_id?: string | null;
          borrower_user_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          active_deal_id?: string | null;
          agent_id?: string | null;
          borrower_business_id?: string | null;
          borrower_user_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          external_id?: string | null;
          id?: string | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_active_deal_id_fkey';
            columns: ['active_deal_id'];
            isOneToOne: true;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_agent_id_fkey';
            columns: ['agent_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: 'business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_business_id_fkey';
            columns: ['borrower_business_id'];
            isOneToOne: false;
            referencedRelation: '_p_business__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_borrower_user_id_fkey';
            columns: ['borrower_user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'opportunity_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_property: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          amenities: string[] | null;
          area_sq_km: number | null;
          building_type: Database['public']['Enums']['building_type'] | null;
          city: string | null;
          county: string | null;
          created_at: string | null;
          deal_id: string | null;
          description: string | null;
          external_id: string | null;
          id: string | null;
          last_census_at: string | null;
          state: Database['public']['Enums']['state_usa'] | null;
          tags: string[] | null;
          type: Database['public']['Enums']['property_type'] | null;
          updated_at: string | null;
          year_built: number | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          amenities?: string[] | null;
          area_sq_km?: number | null;
          building_type?: Database['public']['Enums']['building_type'] | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          last_census_at?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tags?: string[] | null;
          type?: Database['public']['Enums']['property_type'] | null;
          updated_at?: string | null;
          year_built?: number | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          amenities?: string[] | null;
          area_sq_km?: number | null;
          building_type?: Database['public']['Enums']['building_type'] | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          last_census_at?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tags?: string[] | null;
          type?: Database['public']['Enums']['property_type'] | null;
          updated_at?: string | null;
          year_built?: number | null;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_property__admin: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          amenities: string[] | null;
          area_sq_km: number | null;
          building_type: Database['public']['Enums']['building_type'] | null;
          city: string | null;
          county: string | null;
          created_at: string | null;
          deal_id: string | null;
          description: string | null;
          external_id: string | null;
          id: string | null;
          last_census_at: string | null;
          state: Database['public']['Enums']['state_usa'] | null;
          tags: string[] | null;
          type: Database['public']['Enums']['property_type'] | null;
          updated_at: string | null;
          year_built: number | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          amenities?: string[] | null;
          area_sq_km?: number | null;
          building_type?: Database['public']['Enums']['building_type'] | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          last_census_at?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tags?: string[] | null;
          type?: Database['public']['Enums']['property_type'] | null;
          updated_at?: string | null;
          year_built?: number | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          amenities?: string[] | null;
          area_sq_km?: number | null;
          building_type?: Database['public']['Enums']['building_type'] | null;
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          last_census_at?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          tags?: string[] | null;
          type?: Database['public']['Enums']['property_type'] | null;
          updated_at?: string | null;
          year_built?: number | null;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_task: {
        Row: {
          assignee_id: string | null;
          created_at: string | null;
          created_by_id: string | null;
          deal_id: string | null;
          description: string | null;
          external_id: string | null;
          id: string | null;
          priority_id: number | null;
          status_id: number | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          priority_id?: number | null;
          status_id?: number | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          priority_id?: number | null;
          status_id?: number | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: 'task_priority';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_priority';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_priority__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: 'task_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_status__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_task__admin: {
        Row: {
          assignee_id: string | null;
          created_at: string | null;
          created_by_id: string | null;
          deal_id: string | null;
          description: string | null;
          external_id: string | null;
          id: string | null;
          priority_id: number | null;
          status_id: number | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          priority_id?: number | null;
          status_id?: number | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          deal_id?: string | null;
          description?: string | null;
          external_id?: string | null;
          id?: string | null;
          priority_id?: number | null;
          status_id?: number | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: 'deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_deal_id_fkey';
            columns: ['deal_id'];
            isOneToOne: false;
            referencedRelation: '_p_deal__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: 'task_priority';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_priority';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_priority_id_fkey';
            columns: ['priority_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_priority__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: 'task_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: '_p_task_status__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_task_event: {
        Row: {
          comment: string | null;
          created_by: string | null;
          id: number | null;
          metadata: Json | null;
          source: string | null;
          task_id: string | null;
          timestamp: string | null;
        };
        Insert: {
          comment?: string | null;
          created_by?: string | null;
          id?: number | null;
          metadata?: Json | null;
          source?: string | null;
          task_id?: string | null;
          timestamp?: string | null;
        };
        Update: {
          comment?: string | null;
          created_by?: string | null;
          id?: number | null;
          metadata?: Json | null;
          source?: string | null;
          task_id?: string | null;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_task_event__admin: {
        Row: {
          comment: string | null;
          created_by: string | null;
          id: number | null;
          metadata: Json | null;
          source: string | null;
          task_id: string | null;
          timestamp: string | null;
        };
        Insert: {
          comment?: string | null;
          created_by?: string | null;
          id?: number | null;
          metadata?: Json | null;
          source?: string | null;
          task_id?: string | null;
          timestamp?: string | null;
        };
        Update: {
          comment?: string | null;
          created_by?: string | null;
          id?: number | null;
          metadata?: Json | null;
          source?: string | null;
          task_id?: string | null;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_event_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task__admin';
            referencedColumns: ['id'];
          },
        ];
      };
      _p_task_priority: {
        Row: {
          created_at: string | null;
          external_id: string | null;
          id: number | null;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      _p_task_priority__admin: {
        Row: {
          created_at: string | null;
          external_id: string | null;
          id: number | null;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      _p_task_status: {
        Row: {
          created_at: string | null;
          external_id: string | null;
          id: number | null;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      _p_task_status__admin: {
        Row: {
          created_at: string | null;
          external_id: string | null;
          id: number | null;
          label: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          external_id?: string | null;
          id?: number | null;
          label?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      _p_task_subscriber: {
        Row: {
          task_id: string | null;
          user_id: string | null;
        };
        Insert: {
          task_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          task_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_task_subscriber__admin: {
        Row: {
          task_id: string | null;
          user_id: string | null;
        };
        Insert: {
          task_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          task_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: '_p_task__admin';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'task_subscriber_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: '_p_user__admin';
            referencedColumns: ['user_id'];
          },
        ];
      };
      _p_user: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          city: string | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          county: string | null;
          created_at: string | null;
          credit_score: number | null;
          date_of_birth: string | null;
          email: string | null;
          external_id: string | null;
          name: string | null;
          phone: string | null;
          role_name: string | null;
          ssn: string | null;
          state: Database['public']['Enums']['state_usa'] | null;
          updated_at: string | null;
          user_id: string | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          county?: string | null;
          created_at?: string | null;
          credit_score?: number | null;
          date_of_birth?: string | null;
          email?: string | null;
          external_id?: string | null;
          name?: string | null;
          phone?: string | null;
          role_name?: string | null;
          ssn?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          updated_at?: string | null;
          user_id?: string | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          county?: string | null;
          created_at?: string | null;
          credit_score?: number | null;
          date_of_birth?: string | null;
          email?: string | null;
          external_id?: string | null;
          name?: string | null;
          phone?: string | null;
          role_name?: string | null;
          ssn?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          updated_at?: string | null;
          user_id?: string | null;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_role_name_configuration_schema_fkey';
            columns: ['role_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'user_role_name_configuration_schema_fkey';
            columns: ['role_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
      _p_user__admin: {
        Row: {
          address: string | null;
          address_line_2: string | null;
          city: string | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          county: string | null;
          created_at: string | null;
          credit_score: number | null;
          date_of_birth: string | null;
          email: string | null;
          external_id: string | null;
          name: string | null;
          phone: string | null;
          role_name: string | null;
          ssn: string | null;
          state: Database['public']['Enums']['state_usa'] | null;
          updated_at: string | null;
          user_id: string | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          county?: string | null;
          created_at?: string | null;
          credit_score?: number | null;
          date_of_birth?: string | null;
          email?: string | null;
          external_id?: string | null;
          name?: string | null;
          phone?: string | null;
          role_name?: string | null;
          ssn?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          updated_at?: string | null;
          user_id?: string | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          county?: string | null;
          created_at?: string | null;
          credit_score?: number | null;
          date_of_birth?: string | null;
          email?: string | null;
          external_id?: string | null;
          name?: string | null;
          phone?: string | null;
          role_name?: string | null;
          ssn?: string | null;
          state?: Database['public']['Enums']['state_usa'] | null;
          updated_at?: string | null;
          user_id?: string | null;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_role_name_configuration_schema_fkey';
            columns: ['role_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'user_role_name_configuration_schema_fkey';
            columns: ['role_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'user_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
      auth_user: {
        Row: {
          clerk_id: string | null;
          created_at: string | null;
          email: string | null;
          name: string | null;
        };
        Relationships: [];
      };
      column: {
        Row: {
          column_id: number | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          data_type:
            | Database['configuration']['Enums']['supported_pg_data_type']
            | null;
          default_input_type:
            | Database['configuration']['Enums']['input_type']
            | null;
          is_pk: boolean | null;
          is_unique: boolean | null;
          is_updatable: boolean | null;
          name: string | null;
          oid: number | null;
          pg_column: string | null;
          pg_table: string | null;
          pgt_default: string | null;
          pgt_description: string | null;
          pgt_enum: string[] | null;
          pgt_max_len: number | null;
          pgt_name: string | null;
          pgt_nominal_type: string | null;
          pgt_nullable: boolean | null;
          pgt_type: string | null;
          table_id: number | null;
          updated_at: string | null;
          view_name: string | null;
        };
        Insert: {
          column_id?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          data_type?:
            | Database['configuration']['Enums']['supported_pg_data_type']
            | null;
          default_input_type?:
            | Database['configuration']['Enums']['input_type']
            | null;
          is_pk?: boolean | null;
          is_unique?: boolean | null;
          is_updatable?: boolean | null;
          name?: string | null;
          oid?: number | null;
          pg_column?: string | null;
          pg_table?: string | null;
          pgt_default?: string | null;
          pgt_description?: string | null;
          pgt_enum?: string[] | null;
          pgt_max_len?: number | null;
          pgt_name?: string | null;
          pgt_nominal_type?: string | null;
          pgt_nullable?: boolean | null;
          pgt_type?: string | null;
          table_id?: number | null;
          updated_at?: string | null;
          view_name?: string | null;
        };
        Update: {
          column_id?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          data_type?:
            | Database['configuration']['Enums']['supported_pg_data_type']
            | null;
          default_input_type?:
            | Database['configuration']['Enums']['input_type']
            | null;
          is_pk?: boolean | null;
          is_unique?: boolean | null;
          is_updatable?: boolean | null;
          name?: string | null;
          oid?: number | null;
          pg_column?: string | null;
          pg_table?: string | null;
          pgt_default?: string | null;
          pgt_description?: string | null;
          pgt_enum?: string[] | null;
          pgt_max_len?: number | null;
          pgt_name?: string | null;
          pgt_nominal_type?: string | null;
          pgt_nullable?: boolean | null;
          pgt_type?: string | null;
          table_id?: number | null;
          updated_at?: string | null;
          view_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
        ];
      };
      column_role_permission: {
        Row: {
          admin: boolean | null;
          agent: boolean | null;
          auditor: boolean | null;
          borrower: boolean | null;
          column_id: number | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          data_type:
            | Database['configuration']['Enums']['supported_pg_data_type']
            | null;
          default_input_type:
            | Database['configuration']['Enums']['input_type']
            | null;
          is_pk: boolean | null;
          is_unique: boolean | null;
          is_updatable: boolean | null;
          name: string | null;
          oid: number | null;
          pg_column: string | null;
          pg_table: string | null;
          pgt_default: string | null;
          pgt_description: string | null;
          pgt_enum: string[] | null;
          pgt_max_len: number | null;
          pgt_name: string | null;
          pgt_nominal_type: string | null;
          pgt_nullable: boolean | null;
          pgt_type: string | null;
          table_id: number | null;
          underwriter: boolean | null;
          updated_at: string | null;
          view_name: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
        ];
      };
      component: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          created_by_id: string | null;
          description: string | null;
          id: string | null;
          label: string | null;
          role_name: string | null;
          type: Database['configuration']['Enums']['component_type'] | null;
          updated_at: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          created_by_id?: string | null;
          description?: string | null;
          id?: string | null;
          label?: string | null;
          role_name?: string | null;
          type?: Database['configuration']['Enums']['component_type'] | null;
          updated_at?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          created_by_id?: string | null;
          description?: string | null;
          id?: string | null;
          label?: string | null;
          role_name?: string | null;
          type?: Database['configuration']['Enums']['component_type'] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'component_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
      component_version: {
        Row: {
          component_id: string | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          created_by_id: string | null;
          form_id: string | null;
          layout_id: string | null;
          role_name: string | null;
          slug: string | null;
          table_id: string | null;
          type: Database['configuration']['Enums']['component_type'] | null;
          updated_at: string | null;
          version: number | null;
        };
        Insert: {
          component_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          created_by_id?: string | null;
          form_id?: string | null;
          layout_id?: string | null;
          role_name?: string | null;
          slug?: string | null;
          table_id?: string | null;
          type?: Database['configuration']['Enums']['component_type'] | null;
          updated_at?: string | null;
          version?: number | null;
        };
        Update: {
          component_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          created_by_id?: string | null;
          form_id?: string | null;
          layout_id?: string | null;
          role_name?: string | null;
          slug?: string | null;
          table_id?: string | null;
          type?: Database['configuration']['Enums']['component_type'] | null;
          updated_at?: string | null;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'component_version_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_version_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'component_version_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'component_version_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'component_version_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: true;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: true;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: true;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: true;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_table_id_fkey';
            columns: ['table_id'];
            isOneToOne: true;
            referencedRelation: 'table';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_version_table_id_fkey';
            columns: ['table_id'];
            isOneToOne: true;
            referencedRelation: 'table';
            referencedColumns: ['id'];
          },
        ];
      };
      dataset: {
        Row: {
          cached: Json | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          dataview_id: string | null;
          id: string | null;
          query: string | null;
        };
        Insert: {
          cached?: Json | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          dataview_id?: string | null;
          id?: string | null;
          query?: string | null;
        };
        Update: {
          cached?: Json | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          dataview_id?: string | null;
          id?: string | null;
          query?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dataset_dataview_id_fkey';
            columns: ['dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_dataview_id_fkey';
            columns: ['dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
        ];
      };
      dataset_link_filter: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          dataset_id: string | null;
          dataview_column_id: string | null;
          path: string | null;
          source_column_name: string | null;
          source_view_name: string | null;
          target_column_name: string | null;
          target_view_name: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          dataset_id?: string | null;
          dataview_column_id?: string | null;
          path?: string | null;
          source_column_name?: string | null;
          source_view_name?: string | null;
          target_column_name?: string | null;
          target_view_name?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          dataset_id?: string | null;
          dataview_column_id?: string | null;
          path?: string | null;
          source_column_name?: string | null;
          source_view_name?: string | null;
          target_column_name?: string | null;
          target_view_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dataset_link_filter_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_dataview_column_id_fkey';
            columns: ['dataview_column_id'];
            isOneToOne: false;
            referencedRelation: 'dataview_column';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_dataview_column_id_fkey';
            columns: ['dataview_column_id'];
            isOneToOne: false;
            referencedRelation: 'dataview_column';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataset_link_filter_source_view_name_configuration_schema_fkey';
            columns: ['source_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'dataset_link_filter_source_view_name_configuration_schema_fkey';
            columns: ['source_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'dataset_link_filter_target_view_name_configuration_schema_fkey';
            columns: ['target_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
          {
            foreignKeyName: 'dataset_link_filter_target_view_name_configuration_schema_fkey';
            columns: ['target_view_name', 'configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['name', 'configuration_schema'];
          },
        ];
      };
      dataview: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          constraint: string | null;
          dataset_id: string | null;
          id: string | null;
          role_view_name: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          constraint?: string | null;
          dataset_id?: string | null;
          id?: string | null;
          role_view_name?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          constraint?: string | null;
          dataset_id?: string | null;
          id?: string | null;
          role_view_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dataview_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'dataview_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'dataview_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: false;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
        ];
      };
      dataview_column: {
        Row: {
          ag_editable: boolean | null;
          ag_flex: number | null;
          ag_min_width: number | null;
          ag_pinned: Database['configuration']['Enums']['ag_pinned'] | null;
          ag_resizable: boolean | null;
          ag_width: number | null;
          child_dataview_id: string | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          description: string | null;
          header_group: string | null;
          hidden: boolean | null;
          id: string | null;
          input_type: Database['configuration']['Enums']['input_type'] | null;
          label: string | null;
          order: number | null;
          parent_dataview_id: string | null;
          role_column_name: string | null;
          role_view_name: string | null;
        };
        Insert: {
          ag_editable?: boolean | null;
          ag_flex?: number | null;
          ag_min_width?: number | null;
          ag_pinned?: Database['configuration']['Enums']['ag_pinned'] | null;
          ag_resizable?: boolean | null;
          ag_width?: number | null;
          child_dataview_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          description?: string | null;
          header_group?: string | null;
          hidden?: boolean | null;
          id?: string | null;
          input_type?: Database['configuration']['Enums']['input_type'] | null;
          label?: string | null;
          order?: number | null;
          parent_dataview_id?: string | null;
          role_column_name?: string | null;
          role_view_name?: string | null;
        };
        Update: {
          ag_editable?: boolean | null;
          ag_flex?: number | null;
          ag_min_width?: number | null;
          ag_pinned?: Database['configuration']['Enums']['ag_pinned'] | null;
          ag_resizable?: boolean | null;
          ag_width?: number | null;
          child_dataview_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          description?: string | null;
          header_group?: string | null;
          hidden?: boolean | null;
          id?: string | null;
          input_type?: Database['configuration']['Enums']['input_type'] | null;
          label?: string | null;
          order?: number | null;
          parent_dataview_id?: string | null;
          role_column_name?: string | null;
          role_view_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dataview_column_child_dataview_id_fkey';
            columns: ['child_dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_column_child_dataview_id_fkey';
            columns: ['child_dataview_id'];
            isOneToOne: true;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_column_configuration_schema_role_view_name_role_c_fkey';
            columns: [
              'configuration_schema',
              'role_view_name',
              'role_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'dataview_column_configuration_schema_role_view_name_role_c_fkey';
            columns: [
              'configuration_schema',
              'role_view_name',
              'role_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'dataview_column_parent_dataview_id_fkey';
            columns: ['parent_dataview_id'];
            isOneToOne: false;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dataview_column_parent_dataview_id_fkey';
            columns: ['parent_dataview_id'];
            isOneToOne: false;
            referencedRelation: 'dataview';
            referencedColumns: ['id'];
          },
        ];
      };
      environment: {
        Row: {
          clerk_id: string | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          env: Database['auth']['Enums']['env'] | null;
          external_id: string | null;
          name: string | null;
          schema: Database['auth']['Enums']['schema'] | null;
          tenant: Database['auth']['Enums']['tenant'] | null;
          updated_at: string | null;
        };
        Insert: {
          clerk_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          env?: Database['auth']['Enums']['env'] | null;
          external_id?: string | null;
          name?: string | null;
          schema?: Database['auth']['Enums']['schema'] | null;
          tenant?: Database['auth']['Enums']['tenant'] | null;
          updated_at?: string | null;
        };
        Update: {
          clerk_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          env?: Database['auth']['Enums']['env'] | null;
          external_id?: string | null;
          name?: string | null;
          schema?: Database['auth']['Enums']['schema'] | null;
          tenant?: Database['auth']['Enums']['tenant'] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'environment_configuration_schema_fkey';
            columns: ['configuration_schema'];
            isOneToOne: false;
            referencedRelation: 'business_unit';
            referencedColumns: ['configuration_schema'];
          },
        ];
      };
      field: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          default_value: string | null;
          description: string | null;
          form_id: string | null;
          input_type: Database['configuration']['Enums']['input_type'] | null;
          label: string | null;
          name: string | null;
          name_locked: boolean | null;
          options: Json | null;
          placeholder: string | null;
          required: boolean | null;
          section_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          default_value?: string | null;
          description?: string | null;
          form_id?: string | null;
          input_type?: Database['configuration']['Enums']['input_type'] | null;
          label?: string | null;
          name?: string | null;
          name_locked?: boolean | null;
          options?: Json | null;
          placeholder?: string | null;
          required?: boolean | null;
          section_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          default_value?: string | null;
          description?: string | null;
          form_id?: string | null;
          input_type?: Database['configuration']['Enums']['input_type'] | null;
          label?: string | null;
          name?: string | null;
          name_locked?: boolean | null;
          options?: Json | null;
          placeholder?: string | null;
          required?: boolean | null;
          section_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'field_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'field_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'field_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'field_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
        ];
      };
      form: {
        Row: {
          columns: number | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          dataset_id: string | null;
          form_section_id: string | null;
          id: string | null;
          updated_at: string | null;
        };
        Insert: {
          columns?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          dataset_id?: string | null;
          form_section_id?: string | null;
          id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          columns?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          dataset_id?: string | null;
          form_section_id?: string | null;
          id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_form_section_id_fkey';
            columns: ['form_section_id'];
            isOneToOne: true;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_form_section_id_fkey';
            columns: ['form_section_id'];
            isOneToOne: true;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
        ];
      };
      form_instance: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          content: string | null;
          created_at: string | null;
          created_by_id: string | null;
          form_id: string | null;
          id: string | null;
          updated_at: string | null;
          values: Json | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          content?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          form_id?: string | null;
          id?: string | null;
          updated_at?: string | null;
          values?: Json | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          content?: string | null;
          created_at?: string | null;
          created_by_id?: string | null;
          form_id?: string | null;
          id?: string | null;
          updated_at?: string | null;
          values?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_instance_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'form_instance_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'form_instance_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_instance_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
        ];
      };
      form_section: {
        Row: {
          border: boolean | null;
          columns: number | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          description: string | null;
          form_id: string | null;
          id: string | null;
          is_repeated: boolean | null;
          label: string | null;
          order: number | null;
          parent_section_id: string | null;
        };
        Insert: {
          border?: boolean | null;
          columns?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          description?: string | null;
          form_id?: string | null;
          id?: string | null;
          is_repeated?: boolean | null;
          label?: string | null;
          order?: number | null;
          parent_section_id?: string | null;
        };
        Update: {
          border?: boolean | null;
          columns?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          description?: string | null;
          form_id?: string | null;
          id?: string | null;
          is_repeated?: boolean | null;
          label?: string | null;
          order?: number | null;
          parent_section_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_section_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_section_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_section_parent_section_id_fkey';
            columns: ['parent_section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_section_parent_section_id_fkey';
            columns: ['parent_section_id'];
            isOneToOne: false;
            referencedRelation: 'form_section';
            referencedColumns: ['id'];
          },
        ];
      };
      layout: {
        Row: {
          columns: number | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          description: string | null;
          id: string | null;
          label: string | null;
          rows: number | null;
          slug: string | null;
          updated_at: string | null;
        };
        Insert: {
          columns?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          description?: string | null;
          id?: string | null;
          label?: string | null;
          rows?: number | null;
          slug?: string | null;
          updated_at?: string | null;
        };
        Update: {
          columns?: number | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          description?: string | null;
          id?: string | null;
          label?: string | null;
          rows?: number | null;
          slug?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      link: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          constraint: string | null;
          constraint_2: string | null;
          display_name: string | null;
          id: string | null;
          junction_source_column_name: string | null;
          junction_target_column_name: string | null;
          junction_view_name: string | null;
          pgt_columns: string[] | null;
          pgt_columns_2: string[] | null;
          pgt_is_self: boolean | null;
          source_column_name: string | null;
          source_view_name: string | null;
          target_column_name: string | null;
          target_view_name: string | null;
          type: Database['configuration']['Enums']['link_type'] | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          constraint?: string | null;
          constraint_2?: string | null;
          display_name?: string | null;
          id?: string | null;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self?: boolean | null;
          source_column_name?: string | null;
          source_view_name?: string | null;
          target_column_name?: string | null;
          target_view_name?: string | null;
          type?: Database['configuration']['Enums']['link_type'] | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          constraint?: string | null;
          constraint_2?: string | null;
          display_name?: string | null;
          id?: string | null;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self?: boolean | null;
          source_column_name?: string | null;
          source_view_name?: string | null;
          target_column_name?: string | null;
          target_view_name?: string | null;
          type?: Database['configuration']['Enums']['link_type'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_sour_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_sour_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_sour_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_targ_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_targ_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_junction_view_name_junction_targ_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_source_column_n_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_source_column_n_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_source_view_name_source_column_n_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_target_column_n_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_target_column_n_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'link_configuration_schema_target_view_name_target_column_n_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
        ];
      };
      published_component: {
        Row: {
          component_id: string | null;
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          environment_schema: Database['auth']['Enums']['schema'] | null;
          id: string | null;
          published_at: string | null;
          published_by_id: string | null;
          role_name: string | null;
          slug: string | null;
          version: number | null;
        };
        Insert: {
          component_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          environment_schema?: Database['auth']['Enums']['schema'] | null;
          id?: string | null;
          published_at?: string | null;
          published_by_id?: string | null;
          role_name?: string | null;
          slug?: string | null;
          version?: number | null;
        };
        Update: {
          component_id?: string | null;
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          environment_schema?: Database['auth']['Enums']['schema'] | null;
          id?: string | null;
          published_at?: string | null;
          published_by_id?: string | null;
          role_name?: string | null;
          slug?: string | null;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'published_component_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_component_id_version_fkey';
            columns: ['component_id', 'version'];
            isOneToOne: false;
            referencedRelation: 'component_version';
            referencedColumns: ['component_id', 'version'];
          },
          {
            foreignKeyName: 'published_component_component_id_version_fkey';
            columns: ['component_id', 'version'];
            isOneToOne: false;
            referencedRelation: 'component_version';
            referencedColumns: ['component_id', 'version'];
          },
          {
            foreignKeyName: 'published_component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'published_component_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'published_component_environment_schema_fkey';
            columns: ['environment_schema'];
            isOneToOne: false;
            referencedRelation: 'environment';
            referencedColumns: ['schema'];
          },
          {
            foreignKeyName: 'published_component_environment_schema_fkey';
            columns: ['environment_schema'];
            isOneToOne: false;
            referencedRelation: 'environment';
            referencedColumns: ['schema'];
          },
          {
            foreignKeyName: 'published_component_published_by_id_fkey';
            columns: ['published_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
          {
            foreignKeyName: 'published_component_published_by_id_fkey';
            columns: ['published_by_id'];
            isOneToOne: false;
            referencedRelation: 'auth_user';
            referencedColumns: ['clerk_id'];
          },
        ];
      };
      published_component_on_widget: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          id: string | null;
          order: number | null;
          published_component_id: string | null;
          widget_id: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          id?: string | null;
          order?: number | null;
          published_component_id?: string | null;
          widget_id?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          id?: string | null;
          order?: number | null;
          published_component_id?: string | null;
          widget_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'published_component_on_widget_published_component_id_fkey';
            columns: ['published_component_id'];
            isOneToOne: false;
            referencedRelation: 'published_component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_on_widget_published_component_id_fkey';
            columns: ['published_component_id'];
            isOneToOne: false;
            referencedRelation: 'published_component';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_on_widget_widget_id_fkey';
            columns: ['widget_id'];
            isOneToOne: false;
            referencedRelation: 'widget';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'published_component_on_widget_widget_id_fkey';
            columns: ['widget_id'];
            isOneToOne: false;
            referencedRelation: 'widget';
            referencedColumns: ['id'];
          },
        ];
      };
      role: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          name: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          name?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          name?: string | null;
        };
        Relationships: [];
      };
      role_column: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          name: string | null;
          role_view_name: string | null;
          view_name: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          name?: string | null;
          role_view_name?: string | null;
          view_name?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          name?: string | null;
          role_view_name?: string | null;
          view_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'role_column_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_role_view_name_fkey';
            columns: ['configuration_schema', 'role_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_name_fkey';
            columns: ['configuration_schema', 'view_name', 'name'];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_name_fkey';
            columns: ['configuration_schema', 'view_name', 'name'];
            isOneToOne: false;
            referencedRelation: 'column';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
          {
            foreignKeyName: 'role_column_configuration_schema_view_name_name_fkey';
            columns: ['configuration_schema', 'view_name', 'name'];
            isOneToOne: false;
            referencedRelation: 'column_role_permission';
            referencedColumns: ['configuration_schema', 'view_name', 'name'];
          },
        ];
      };
      role_link: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          constraint: string | null;
          constraint_2: string | null;
          display_name: string | null;
          id: string | null;
          junction_source_column_name: string | null;
          junction_target_column_name: string | null;
          junction_view_name: string | null;
          pgt_columns: string[] | null;
          pgt_columns_2: string[] | null;
          pgt_is_self: boolean | null;
          source_column_name: string | null;
          source_view_name: string | null;
          target_column_name: string | null;
          target_view_name: string | null;
          type: Database['configuration']['Enums']['link_type'] | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          constraint?: string | null;
          constraint_2?: string | null;
          display_name?: string | null;
          id?: string | null;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self?: boolean | null;
          source_column_name?: string | null;
          source_view_name?: string | null;
          target_column_name?: string | null;
          target_view_name?: string | null;
          type?: Database['configuration']['Enums']['link_type'] | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          constraint?: string | null;
          constraint_2?: string | null;
          display_name?: string | null;
          id?: string | null;
          junction_source_column_name?: string | null;
          junction_target_column_name?: string | null;
          junction_view_name?: string | null;
          pgt_columns?: string[] | null;
          pgt_columns_2?: string[] | null;
          pgt_is_self?: boolean | null;
          source_column_name?: string | null;
          source_view_name?: string | null;
          target_column_name?: string | null;
          target_view_name?: string | null;
          type?: Database['configuration']['Enums']['link_type'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'role_link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_junction_view_name_fkey';
            columns: ['configuration_schema', 'junction_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_fkey';
            columns: ['configuration_schema', 'source_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_source_col_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_source_view_name_source_col_fkey';
            columns: [
              'configuration_schema',
              'source_view_name',
              'source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_fkey';
            columns: ['configuration_schema', 'target_view_name'];
            isOneToOne: false;
            referencedRelation: 'role_view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_target_col_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_configuration_schema_target_view_name_target_col_fkey';
            columns: [
              'configuration_schema',
              'target_view_name',
              'target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_source_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_source_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_source_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_target_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
          {
            foreignKeyName: 'role_link_junction_target_column_fkey';
            columns: [
              'configuration_schema',
              'junction_view_name',
              'junction_target_column_name',
            ];
            isOneToOne: false;
            referencedRelation: 'role_column';
            referencedColumns: [
              'configuration_schema',
              'role_view_name',
              'name',
            ];
          },
        ];
      };
      role_view: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          name: string | null;
          pgt_deletable: boolean | null;
          pgt_description: string | null;
          pgt_insertable: boolean | null;
          pgt_is_view: boolean | null;
          pgt_pk_cols: string[] | null;
          pgt_updatable: boolean | null;
          role_name: string | null;
          view_name: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          name?: string | null;
          pgt_deletable?: boolean | null;
          pgt_description?: string | null;
          pgt_insertable?: boolean | null;
          pgt_is_view?: boolean | null;
          pgt_pk_cols?: string[] | null;
          pgt_updatable?: boolean | null;
          role_name?: string | null;
          view_name?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          name?: string | null;
          pgt_deletable?: boolean | null;
          pgt_description?: string | null;
          pgt_insertable?: boolean | null;
          pgt_is_view?: boolean | null;
          pgt_pk_cols?: string[] | null;
          pgt_updatable?: boolean | null;
          role_name?: string | null;
          view_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'role_view_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_view_configuration_schema_role_name_fkey';
            columns: ['configuration_schema', 'role_name'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_view_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
          {
            foreignKeyName: 'role_view_configuration_schema_view_name_fkey';
            columns: ['configuration_schema', 'view_name'];
            isOneToOne: false;
            referencedRelation: 'view';
            referencedColumns: ['configuration_schema', 'name'];
          },
        ];
      };
      schema_columns: {
        Row: {
          character_maximum_length: number | null;
          column_default: string | null;
          column_id: number | null;
          column_name: unknown | null;
          data_type: string | null;
          has_unique_index: boolean | null;
          is_nullable: string | null;
          is_pk: boolean | null;
          is_updatable: string | null;
          numeric_precision: number | null;
          numeric_scale: number | null;
          references_table: unknown | null;
          table_id: unknown | null;
          table_name: unknown | null;
          table_schema: unknown | null;
          table_type: string | null;
        };
        Relationships: [];
      };
      schema_columns__admin: {
        Row: {
          character_maximum_length: number | null;
          column_default: string | null;
          column_id: number | null;
          column_name: unknown | null;
          data_type: string | null;
          has_unique_index: boolean | null;
          is_nullable: string | null;
          is_pk: boolean | null;
          is_updatable: string | null;
          numeric_precision: number | null;
          numeric_scale: number | null;
          references_table: unknown | null;
          table_id: unknown | null;
          table_name: unknown | null;
          table_schema: unknown | null;
          table_type: string | null;
        };
        Relationships: [];
      };
      table: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          dataset_id: string | null;
          id: string | null;
          updated_at: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          dataset_id?: string | null;
          id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          dataset_id?: string | null;
          id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'table_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'table_dataset_id_fkey';
            columns: ['dataset_id'];
            isOneToOne: true;
            referencedRelation: 'dataset';
            referencedColumns: ['id'];
          },
        ];
      };
      tile: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          default_open: boolean | null;
          description: string | null;
          grid_end: number | null;
          grid_start: number | null;
          height: number | null;
          id: string | null;
          label: string | null;
          layout_id: string | null;
          order: number | null;
          updated_at: string | null;
          width: number | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          default_open?: boolean | null;
          description?: string | null;
          grid_end?: number | null;
          grid_start?: number | null;
          height?: number | null;
          id?: string | null;
          label?: string | null;
          layout_id?: string | null;
          order?: number | null;
          updated_at?: string | null;
          width?: number | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          default_open?: boolean | null;
          description?: string | null;
          grid_end?: number | null;
          grid_start?: number | null;
          height?: number | null;
          id?: string | null;
          label?: string | null;
          layout_id?: string | null;
          order?: number | null;
          updated_at?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tile_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: false;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tile_layout_id_fkey';
            columns: ['layout_id'];
            isOneToOne: false;
            referencedRelation: 'layout';
            referencedColumns: ['id'];
          },
        ];
      };
      view: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          created_at: string | null;
          name: string | null;
          pg_primary_table: string | null;
          pgt_deletable: boolean | null;
          pgt_description: string | null;
          pgt_insertable: boolean | null;
          pgt_is_view: boolean | null;
          pgt_pk_cols: string[] | null;
          pgt_updatable: boolean | null;
          type: Database['configuration']['Enums']['view_type'] | null;
          updated_at: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          name?: string | null;
          pg_primary_table?: string | null;
          pgt_deletable?: boolean | null;
          pgt_description?: string | null;
          pgt_insertable?: boolean | null;
          pgt_is_view?: boolean | null;
          pgt_pk_cols?: string[] | null;
          pgt_updatable?: boolean | null;
          type?: Database['configuration']['Enums']['view_type'] | null;
          updated_at?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          created_at?: string | null;
          name?: string | null;
          pg_primary_table?: string | null;
          pgt_deletable?: boolean | null;
          pgt_description?: string | null;
          pgt_insertable?: boolean | null;
          pgt_is_view?: boolean | null;
          pgt_pk_cols?: string[] | null;
          pgt_updatable?: boolean | null;
          type?: Database['configuration']['Enums']['view_type'] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      widget: {
        Row: {
          configuration_schema: Database['auth']['Enums']['schema'] | null;
          description: string | null;
          id: string | null;
          label: string | null;
          order: number | null;
          tile_id: string | null;
        };
        Insert: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          description?: string | null;
          id?: string | null;
          label?: string | null;
          order?: number | null;
          tile_id?: string | null;
        };
        Update: {
          configuration_schema?: Database['auth']['Enums']['schema'] | null;
          description?: string | null;
          id?: string | null;
          label?: string | null;
          order?: number | null;
          tile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'widget_tile_id_fkey';
            columns: ['tile_id'];
            isOneToOne: false;
            referencedRelation: 'tile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'widget_tile_id_fkey';
            columns: ['tile_id'];
            isOneToOne: false;
            referencedRelation: 'tile';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      component_create: {
        Args: {
          p_role_view_name: string;
          p_type: Database['configuration']['Enums']['component_type'];
          p_label: string;
          p_description: string;
          p_user_id: string;
          p_role_name: string;
          p_slug?: string;
        };
        Returns: {
          component_id: string;
          component_version: number;
        }[];
      };
      component_version_duplicate: {
        Args: {
          p_component_id: string;
          p_version: number;
        };
        Returns: Json;
      };
      dataset_create: {
        Args: {
          p_role_view_name: string;
        };
        Returns: string;
      };
      form_create: {
        Args: {
          p_role_view_name: string;
        };
        Returns: {
          form_id: string;
          dataset_id: string;
        }[];
      };
      layout_duplicate: {
        Args: {
          p_id: string;
        };
        Returns: {
          columns: number;
          configuration_schema: Database['auth']['Enums']['schema'];
          created_at: string;
          description: string | null;
          id: string;
          label: string | null;
          rows: number;
          slug: string;
          updated_at: string;
        };
      };
      table_create: {
        Args: {
          p_role_view_name: string;
        };
        Returns: {
          table_id: string;
          dataset_id: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_unique_indexes: {
        Args: {
          schema_names: Database['auth']['Enums']['schema'][];
          table_column_pairs: string[];
        };
        Returns: undefined;
      };
      component_create: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      component_version_duplicate: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_admin_views: {
        Args: {
          schemas: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_auth_views: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_configuration_schema_views: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_default_roles_and_grant_access_to_schemas: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_role_if_not_exists: {
        Args: {
          role_name: string;
          with_login?: boolean;
          with_noinherit?: boolean;
          with_password?: string;
        };
        Returns: undefined;
      };
      create_role_permissions: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_schema_columns_views: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      create_table_master_views: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      dataset_create: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      form_create: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      initialize_schema_data: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      layout_duplicate: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      set_up_schemas: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
      table_create: {
        Args: {
          schema_list: Database['auth']['Enums']['schema'][];
        };
        Returns: undefined;
      };
    };
    Enums: {
      building_type: 'condo' | 'multi_family' | 'single_family';
      deal_event_type: 'update' | 'state_change' | 'event' | 'error' | 'info';
      environment_type: 'production' | 'uat' | 'development';
      property_type: 'commercial' | 'residential';
      state_usa:
        | 'AL'
        | 'AK'
        | 'AZ'
        | 'AR'
        | 'CA'
        | 'CO'
        | 'CT'
        | 'DE'
        | 'FL'
        | 'GA'
        | 'HI'
        | 'ID'
        | 'IL'
        | 'IN'
        | 'IA'
        | 'KS'
        | 'KY'
        | 'LA'
        | 'ME'
        | 'MD'
        | 'MA'
        | 'MI'
        | 'MN'
        | 'MS'
        | 'MO'
        | 'MT'
        | 'NE'
        | 'NV'
        | 'NH'
        | 'NJ'
        | 'NM'
        | 'NY'
        | 'NC'
        | 'ND'
        | 'OH'
        | 'OK'
        | 'OR'
        | 'PA'
        | 'RI'
        | 'SC'
        | 'SD'
        | 'TN'
        | 'TX'
        | 'UT'
        | 'VT'
        | 'VA'
        | 'WA'
        | 'WV'
        | 'WI'
        | 'WY';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
