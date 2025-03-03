'use client';

import { toast } from '@repo/ui/components/toast-sonner';
import {
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ComboboxMulti } from '@repo/ui/components/combobox-multi';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';

import { useEnvironment } from '~/app/main/environment.provider';
import postgrest from '~/lib/database/postgrest';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import type { TablesConfiguration } from '~/lib/database/helpers';

interface ConfigurationPageProps {
  params: { datasetId: string; version: string };
}

export default function SettingsPage({
  params: { datasetId, version },
}: Readonly<ConfigurationPageProps>) {
  const { environment_schema } = useEnvironment();
  const [linkFilters, setLinkFilters] = useState<string[]>([]);
  const {
    data: datasetVersion,
    isLoading: isLoadingDatasetVersion,
    error: errorDatasetVersion,
    refetch,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('dataset_version')
      .select(
        `
        dataset_id,
        dataview_id,
        version,
        dataset_link_filter(*)
        `
      )
      .eq('dataset_id', datasetId)
      .eq('version', parseInt(version))
      .single()
  );

  useEffect(() => {
    setLinkFilters(
      datasetVersion?.dataset_link_filter.map(dataset_link_filter =>
        linkEntityToValue(
          dataset_link_filter as TablesConfiguration<'dataset_link_filter'>,
          dataset_link_filter.dataview_column_id ?? ''
        )
      ) ?? []
    );
  }, [datasetVersion?.dataset_link_filter]);
  ("Try changing 'role_view' to one of the following: 'role_view!role_link_schema_junction_view_name_fkey', 'role_view!role_link_schema_source_view_name_fkey', 'role_view!role_link_schema_target_view_name_fkey'");

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(schema)
      .from('dataview')
      .select(
        `
        id,
        role_view_name,
        dataview_column!dataview_column_parent_dataview_id_fkey(
          id,
          child_dataview_id,
          role_column(
            name,
            role_link!role_link_schema_source_view_name_source_column_name_fkey(
              *,
              role_view!role_link_schema_target_view_name_fkey(
                name,
                pgt_pk_cols
              )
            )
          )
        ),
        role_view(
          view_name,
          pgt_pk_cols
        )
        `
      )
      .eq('dataset_id', datasetId)
      .eq('dataset_version_number', parseInt(version))
  );

  const { mutate: upsertLinkFilter } = useUpsertMutation(
    postgrest.schema(schema).from('dataset_link_filter'),
    [
      'dataset_id',
      'dataset_version_number',
      'source_view_name',
      'source_column_name',
      'target_view_name',
      'target_column_name',
    ],
    '*',
    {
      onSuccess: () => {
        void refetch();
      },
      onError: () => {
        toast.error('Unable to update query.');
      },
    }
  );

  const handleContextFiltersUpdate = async (values: string[]) => {
    setLinkFilters(values);
    await postgrest
      .schema(schema)
      .from('dataset_link_filter')
      .delete()
      .eq('dataset_id', datasetId)
      .eq('dataset_version_number', parseInt(version))
      .then(() => {
        return upsertLinkFilter(
          values.map(linkFilterJson => {
            const link = JSON.parse(linkFilterJson) as LinkJSON;
            let path: string = link.source_column_name;
            let dataview = data?.find(
              dataview =>
                dataview.dataview_column.find(
                  column => column.id === link.dataview_column_id
                ) !== undefined
            );
            while (dataview?.id !== datasetVersion?.dataview_id) {
              path = `${dataview?.role_view_name ?? ''}.${path}`;
              dataview = data?.find(
                dataview =>
                  dataview.dataview_column.find(
                    column => column.child_dataview_id === dataview.id
                  ) !== undefined
              );
            }
            return {
              dataset_id: datasetId,
              dataset_version_number: parseInt(version),
              source_view_name: link.source_view_name,
              source_column_name: link.source_column_name,
              target_view_name: link.target_view_name,
              target_column_name: link.target_column_name,
              schema: schema,
              dataview_column_id: link.dataview_column_id,
              path,
            };
          })
        );
      });
  };

  const assertDatasetIncludesBothManyToManyColumns = useCallback(
    (role_link: TablesConfiguration<'role_link'>): boolean => {
      if (!role_link.junction_view_name) {
        return true;
      }

      return (
        data
          ?.find(
            dataview => dataview.role_view_name === role_link.source_view_name
          )
          ?.dataview_column.find(
            column => column.role_column?.name === role_link.source_column_name
          ) !== undefined &&
        data
          .find(
            dataview => dataview.role_view_name === role_link.target_view_name
          )
          ?.dataview_column.find(
            column => column.role_column?.name === role_link.target_column_name
          ) !== undefined
      );
    },
    [data]
  );

  const linkOptions = useMemo(() => {
    const options =
      data?.flatMap(dataview =>
        // Search dataview columns
        dataview.dataview_column
          // do not include columns acting as links for more dataviews
          .filter(column => !column.child_dataview_id)
          .flatMap(
            dataview_column =>
              // create an option for those columns that have a link (relation)
              dataview_column.role_column?.role_link
                .filter(
                  role_link =>
                    (role_link.role_view?.pgt_pk_cols?.length ?? 2) < 2 && // ignore junctioo tables for now
                    role_link.role_view?.pgt_pk_cols?.includes(
                      // must point to a pk 9only k's get added to page/layout context so only pks can be used to filterby)
                      role_link.target_column_name ?? ''
                    ) &&
                    assertDatasetIncludesBothManyToManyColumns(
                      role_link as TablesConfiguration<'role_link'>
                    )
                )
                .map(role_link => {
                  return {
                    label: (
                      <div>
                        <Badge>{`${role_link.display_name} ${role_link.target_view_name}.[${role_link.target_column_name}]`}</Badge>{' '}
                        filter by{' '}
                        {`${role_link.source_view_name}[${role_link.source_column_name}]`}
                      </div>
                    ),
                    value: linkEntityToValue(
                      role_link as TablesConfiguration<'role_link'>,
                      dataview_column.id ?? ''
                    ),
                  };
                }) ?? []
          )
      ) ?? [];
    // many to manys are going toshow twice so need to filter
    const valueSet = new Set<string>();
    const filteredOptions = options.filter(option => {
      const isDuplicate = valueSet.has(option.value);
      valueSet.add(option.value);
      return !isDuplicate;
    });
    return filteredOptions;
  }, [data, assertDatasetIncludesBothManyToManyColumns]);

  if (isLoading || isLoadingDatasetVersion) {
    return <LoadingPage />;
  }

  if (error ?? errorDatasetVersion) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <ComboboxMulti
        label="Context Link Filter"
        placeholder="Select an link..."
        onChange={handleContextFiltersUpdate}
        value={linkFilters}
        options={linkOptions}
        description="When this dataset is used on a layout for a matching link entity, it will automatically filter results to the most granular link. For example, a dataset with a 'Deal' context link filter used on a Deal Layout will only show records for that deal."
      />
      <Alert variant="warn">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Watch Out</AlertTitle>
        <AlertDescription>
          Removing a column one of these filters depends on will automatically
          delete the filter.
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface LinkJSON {
  source_view_name: string;
  source_column_name: string;
  target_view_name: string;
  target_column_name: string;
  dataview_column_id: string;
}

const linkEntityToValue = (
  entity:
    | TablesConfiguration<'role_link'>
    | TablesConfiguration<'dataset_link_filter'>,
  dataview_column_id: string
) => {
  return JSON.stringify({
    source_view_name: entity.source_view_name,
    source_column_name: entity.source_column_name,
    target_view_name: entity.target_view_name,
    target_column_name: entity.target_column_name,
    dataview_column_id,
  });
};
