'use client';

import { Button } from '@repo/ui/components/button';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { AgGridReact } from 'ag-grid-react';
import FormDialog from '@repo/ui/components/form-dialog';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { toast } from '@repo/ui/components/toast-sonner';
import { useMemo, type ReactNode } from 'react';
import ComboboxField from '@repo/ui/form-builder/fields/combobox.field';
import { useRouter } from 'next/navigation';

import { useEnvironment } from '../environment.provider';

import postgrest from '~/lib/database/postgrest';
import {
  AgGridWrapper,
  dataTypeDefinitions,
  defaultColumnTypes,
  LinkCell,
  themeQuartzGridOptions,
} from '~/modules/client-ag-grid';
import { PageWrapper } from '~/modules/layout';
import { TypedRoutes } from '~/lib/routes';

const datasetFormSchema = z.object({
  role_view_name: z.string(),
});

export default function Dataset() {
  const { environment_schema } = useEnvironment();

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('dataset')
      .select(
        `
        *,
        dataview!dataset_dataview_id_fkey(
          id,
          role_view_name
        )
        `
      )
      .order('created_at', { ascending: false })
      .eq('latest', true)
  );

  type TData = NonNullable<typeof data>[number];

  const columnDefs: ColDef<TData>[] = useMemo(
    () => [
      {
        pinned: 'left',
        width: 20,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<TData>) => {
          return (
            <LinkCell
              href={TypedRoutes.dataset({
                datasetId: params.data?.id ?? '',
              })}
            />
          );
        },
      },
      {
        field: 'id',
        headerName: 'ID',
        width: 130,
      },
      {
        field: 'dataview.role_view_name',
        headerName: 'Selects',
        flex: 1,
      },
    ],
    []
  );

  return (
    <PageWrapper>
      <AgGridWrapper
        rightBar={
          <CreateDatasetModal>
            <Button>New Dataset</Button>
          </CreateDatasetModal>
        }
        error={error}
      >
        <AgGridReact<TData>
          dataTypeDefinitions={dataTypeDefinitions}
          rowData={data}
          loading={isLoading}
          columnDefs={columnDefs}
          columnTypes={defaultColumnTypes}
          gridOptions={themeQuartzGridOptions}
        />
      </AgGridWrapper>
    </PageWrapper>
  );
}

const CreateDatasetModal = ({ children }: { children: ReactNode }) => {
  const { environment_schema } = useEnvironment();
  const router = useRouter();

  const { data: roleViews } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('role_view')
      .select(`name,view_name`)
      .eq('role_name', 'admin')
      .eq('role_name', 'admin')
  );

  const { form, handleSubmit } = useStandardForm<
    z.infer<typeof datasetFormSchema>
  >({
    resolver: zodResolver(datasetFormSchema),
    defaultValues: {},
    handleSubmit: async ({ role_view_name }) => {
      return postgrest
        .schema(environment_schema)
        .rpc('dataset_create', {
          p_role_view_name: role_view_name,
        })
        .single()
        .then(result => {
          if (!result.error) {
            toast.success('Dataset created');
            return router.push(
              TypedRoutes.dataset({
                datasetId: result.data,
              })
            );
          } else {
            toast.error('Unable to create dataset');
            throw new Error('Failed');
          }
        });
    },
  });

  return (
    <FormDialog
      form={form}
      title="New Dataset"
      description="Create a new dataset that can query your system. Use datasets to create tables, forms or other components within layouts."
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <ComboboxField
        name="role_view_name"
        label="What entity do you want to query?"
        options={
          roleViews?.map(roleView => ({
            label: roleView.name!,
            value: roleView.name!,
          })) ?? []
        }
      />
    </FormDialog>
  );
};
