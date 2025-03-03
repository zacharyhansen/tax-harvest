import { toast } from '@repo/ui/components/toast-sonner';
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useMemo } from 'react';

import { useEnvironment } from '~/app/main/environment.provider';
import { useViewContext } from '~/app/main/view-context.provider';
import type { Database } from '~/lib/database/database.types';
import postgrest from '~/lib/database/postgrest';

export const useDatasetQuery = ({
  datasetId,
  limit,
}: {
  datasetId: string;
  limit?: number;
}) => {
  const { environment_schema } = useEnvironment();
  const { roleViewContext } = useViewContext();

  const DATASET_VERSION_QUERY = postgrest
    .schema(environment_schema)
    .from('dataset')
    .select(
      `
      id,
      query,
      dataview!dataset_dataview_id_fkey(
        role_view(  
          name,
          pgt_pk_cols
        ),
        dataview_column!dataview_column_parent_dataview_id_fkey(
          *,
          dataview!dataview_column_child_dataview_id_fkey(
            role_view_name
          )
        )
      ),
      dataset_link_filter(*)
      `
    )
    .eq('id', datasetId);

  const {
    data: dataset,
    isLoading: isLoadingDataset,
    error: errorConfiguration,
    refetch,
  } = useQuery(DATASET_VERSION_QUERY.single());

  const targetTable = dataset?.dataview?.role_view
    ?.name as keyof Database['foundation']['Views'];
  const entityPrimaryKeys = dataset?.dataview?.role_view?.pgt_pk_cols;

  const DATA_QUERY = useMemo(() => {
    const QUERY = postgrest
      .schema(environment_schema)
      .from(targetTable)
      .select(dataset?.query ?? '');

    if (dataset?.dataset_link_filter.length) {
      const applicableLinkFilters = dataset.dataset_link_filter.filter(
        link =>
          !!roleViewContext[link.target_view_name ?? '']?.[
            link.target_column_name ?? ''
          ]
      );

      applicableLinkFilters.forEach(linkFilter => {
        void QUERY.eq(
          linkFilter.path!,
          roleViewContext[linkFilter.target_view_name!]![
            linkFilter.target_column_name!
          ]!
        );
      });
    }

    if (limit) {
      void QUERY.limit(limit);
    }
    return QUERY;
  }, [
    dataset?.dataset_link_filter,
    dataset?.query,
    environment_schema,
    targetTable,
    roleViewContext,
    limit,
  ]);

  const {
    data,
    error: errorData,
    isLoading,
    // @ts-expect-error go away error
  } = useQuery<Record<string, unknown>[]>(DATA_QUERY, {
    enabled: !!dataset?.query,
  });

  const { mutate: updateRecord } = useUpdateMutation(
    postgrest.schema(environment_schema).from(targetTable),
    // @ts-expect-error go away error
    entityPrimaryKeys,
    '*',
    {
      onError: error => {
        console.error({ error });
        toast.error('An error occurred.');
      },
      onSuccess: () => {
        toast.success('Saved');
      },
    }
  );

  return {
    data,
    errorData,
    dataset,
    errorConfiguration,
    isLoading: isLoading || isLoadingDataset,
    refetch,
    entityPrimaryKeys,
    targetTable,
    updateRecord,
  };
};
