'use client';

import { Button } from '@repo/ui/components/button';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { AgGridReact } from 'ag-grid-react';
import FormDialog from '@repo/ui/components/form-dialog';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { toast } from '@repo/ui/components/toast-sonner';
import { useMemo, type ReactNode } from 'react';
import ComboboxField from '@repo/ui/form-builder/fields/combobox.field';
import { useRouter } from 'next/navigation';
import { capitalCase } from 'change-case';
import { Badge } from '@repo/ui/components/badge';

import postgrest from '~/lib/database/postgrest';
import {
  AgGridWrapper,
  dataTypeDefinitions,
  defaultColumnTypes,
  LinkCell,
  AuthUserCell,
  themeQuartzGridOptions,
} from '~/modules/client-ag-grid';
import { PageWrapper } from '~/modules/layout';
import { useEnvironment } from '~/app/main/environment.provider';
import { useUser } from '~/app/main/user.provider';
import { TypedRoutes } from '~/lib/routes';
import { ComponentType, enumToOptions } from '~/lib/constants/enums.dto';
const datasetFormSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  role_view_name: z.string(),
  type: z.nativeEnum(ComponentType),
});

export default function Page() {
  const { environment_schema } = useEnvironment();

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component')
      .select(
        `
        id,
        type,
        label,
        created_at,
        description,
        auth_user(
          email,
          name
        ),
        published_component(
          id,
          version,
          published_at,
          auth_user(
            email,
            name,
            clerk_id,
            created_at
          )
        )
        `
      )
      .order('created_at', { ascending: false })
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
              href={TypedRoutes.component({
                componentId: params.data?.id ?? '',
              })}
            />
          );
        },
      },
      {
        field: 'label',
        width: 200,
        editable: true,
      },
      {
        field: 'type',
        width: 200,
        cellRenderer: (params: ICellRendererParams<TData>) => {
          return <Badge>{capitalCase(params.data?.type ?? '')}</Badge>;
        },
      },
      {
        field: 'description',
        flex: 1,
        editable: true,
      },
      {
        field: 'published_component',
        width: 200,
        cellRenderer: (params: ICellRendererParams<TData>) => {
          return (
            <Badge variant="secondary">
              {params.data?.published_component.length
                ? `v${params.data.published_component[0]?.version} Published`
                : 'Unpublished'}
            </Badge>
          );
        },
        headerName: 'Published',
      },
      {
        field: 'published_component',
        width: 200,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <AuthUserCell
              {...params}
              value={
                params.data?.published_component[0]?.auth_user ?? undefined
              }
            />
          );
        },
        headerName: 'Published By',
      },
      {
        field: 'created_at',
        headerName: 'Created At',
        cellDataType: 'timeStamp',
        width: 200,
      },
    ],
    []
  );

  return (
    <PageWrapper>
      <AgGridWrapper
        rightBar={
          <CreateDialog>
            <Button>New Component</Button>
          </CreateDialog>
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

const CreateDialog = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
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
    defaultValues: {
      label: '',
      description: '',
    },
    handleSubmit: async ({ type, label, description, role_view_name }) => {
      return postgrest
        .schema(environment_schema)
        .rpc('component_create', {
          p_type: type,
          p_label: label,
          p_description: description ?? '',
          p_user_id: user.user_id,
          p_role_view_name: role_view_name,
          p_role_name: user.role_name,
        })
        .single()
        .then(result => {
          if (!result.error) {
            router.push(
              TypedRoutes.componentVersion({
                componentId: result.data.component_id,
                version: result.data.component_version,
              })
            );
            return toast.success('Component created');
          } else {
            toast.error('Unable to create component');
            throw new Error('Failed to create component');
          }
        });
    },
  });

  return (
    <FormDialog
      form={form}
      title="New Component"
      description="Create a new component"
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField name="label" label="Name" autoFocus />
      <ComboboxField
        name="type"
        label="Type"
        options={enumToOptions(ComponentType)}
      />
      <InputField
        name="description"
        label="Description"
        description="What does this data represent?"
      />
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
