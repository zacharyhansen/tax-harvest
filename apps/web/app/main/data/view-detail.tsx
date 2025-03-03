import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { capitalCase } from 'change-case';
import { useMemo, type RefObject } from 'react';
import type { ValueGetterParams } from 'ag-grid-community';

import postgrest from '~/lib/database/postgrest';
import { type TablesFoundation } from '~/lib/database/helpers';
import { AgGridWrapper, dataTypeDefinitions } from '~/modules/client-ag-grid';
import { ErrorPage } from '~/modules/utility-components';

interface ViewDetailProps {
  /** The name of the postgres view/table */
  name: string;
  gridReference: RefObject<AgGridReact>;
}

export default function ViewDetail({
  name,
  gridReference,
}: Readonly<ViewDetailProps>) {
  const {
    data: roles,
    error: rolesError,
    isLoading: rolesLoading,
  } = useQuery(postgrest.schema('foundation').from('role').select('name'));

  const {
    data: columnRolePermissions,
    error: columnRolePermissionsError,
    isLoading: columnRolePermissionsLoading,
  } = useQuery(
    postgrest
      .schema('foundation')
      .from('column_role_permission')
      .select('*')
      .eq('view_name', name)
  );

  const columnDefs = useMemo(() => {
    return [
      {
        field: 'name',
        headerName: 'Column',
        flex: 1,
        minWidth: 150,
        valueFormatter: ({ value }: { value: string }) =>
          capitalCase(value || ''),
      },
      ...(roles
        ?.filter(role => role.name !== 'admin')
        .map(role => ({
          field: role.name!,
          headerName: capitalCase(role.name!),
          width: 150,
          cellDataType: 'boolean',
          cellRendererParams: { disabled: false },
          cellRenderer: 'agCheckboxCellRenderer',
          cellEditor: 'agCheckboxCellEditor',
          // valueGetter: (params: ValueGetterParams) => !!params.data[role.name!],
        })) ?? []),
      {
        field: 'pg_data_type',
        headerName: 'Type',
        width: 150,
      },
      {
        field: 'is_unique',
        headerName: 'Unique?',
        width: 150,
        cellDataType: 'boolean',
        valueGetter: (params: ValueGetterParams) => !!params.data.is_unique,
      },
      {
        field: 'is_pk',
        headerName: 'Primary Key?',
        width: 150,
        cellDataType: 'boolean',
        valueGetter: (params: ValueGetterParams) => !!params.data.is_pk,
      },
      {
        field: 'is_nullable',
        headerName: 'Nullable?',
        cellDataType: 'boolean',
        valueGetter: (params: ValueGetterParams) => !!params.data.is_nullable,
        width: 100,
      },
      {
        field: 'references_table',
        headerName: 'References',
        valueFormatter: ({ value }: { value: string }) =>
          capitalCase(value || ''),
        width: 150,
      },
      {
        headerName: 'Character Length',
        field: 'character_maximum_length',
        width: 200,
      },
      {
        headerName: 'Num Precision',
        field: 'numeric_precision',
        width: 200,
      },
      {
        headerName: 'Default',
        field: 'column_default',
        width: 200,
      },
      {
        headerName: 'Field',
        field: 'field_type',
        width: 200,
      },
      {
        headerName: 'Default Input Type',
        field: 'input_type',
        width: 200,
      },
    ];
  }, [roles]);

  if (rolesError || columnRolePermissionsError) {
    console.error({ rolesError });
    return <ErrorPage message="There was an error loading your data." />;
  }

  return (
    <AgGridWrapper>
      <AgGridReact<TablesFoundation<'column_role_permission'>>
        dataTypeDefinitions={dataTypeDefinitions}
        rowData={columnRolePermissions ?? []}
        loading={rolesLoading || columnRolePermissionsLoading}
        // @ts-expect-error idk how to type the dynamic role columns
        columnDefs={columnDefs}
        undoRedoCellEditing={true}
        undoRedoCellEditingLimit={100}
        ref={gridReference}
      />
    </AgGridWrapper>
  );
}
