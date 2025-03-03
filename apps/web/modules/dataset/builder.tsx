'use client';

import {
  useDeleteMutation,
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { Button } from '@repo/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { TreeView, type TreeDataItem } from '@repo/ui/components/tree-view';
import {
  CheckCircle,
  CirclePlus,
  DiamondMinus,
  DiamondPlus,
  Link,
  MinusCircle,
  RectangleEllipsis,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { inferRouterOutputs } from '@trpc/server';
import { Badge } from '@repo/ui/components/badge';
import { toast } from '@repo/ui/components/toast-sonner';

import type { AppRouter } from '../../../api/@generated/server';

import type { DatasetOutput, DataviewOutput } from './dataset.dto';
import { findDataviewById, findParentColumnOfDataviewById } from './utils';
import { useDataset } from './dataset.provider';

import { trpc } from '~/lib/trpc';
import postgrest from '~/lib/database/postgrest';
import type { TablesConfiguration } from '~/lib/database/helpers';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import type { Database } from '~/lib/database/database.types';
import { useEnvironment } from '~/app/main/environment.provider';

export default function DatasetBuilder() {
  const { environment_schema } = useEnvironment();
  const { dataset: datasetContext } = useDataset();
  const { data, error, isLoading } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('role')
      .select(`*`)
      .eq('name', 'admin')
      .single<TablesConfiguration<'role'>>()
  );

  const { data: dataset, isLoading: isLoadingDataset } =
    trpc.dataset.dataset.useQuery<DatasetOutput>({
      datasetId: datasetContext.id,
    });

  if (error) {
    return (
      <ErrorPage
        title="Missing Role"
        message="We were unable to locate the requested role in the system."
      />
    );
  }

  if (isLoading || isLoadingDataset || !dataset || !data) {
    return <LoadingPage message="Fetching dataset" />;
  }

  if (!dataset.dataview) {
    return <ErrorPage message="Missing root dataview" />;
  }

  return (
    <DataBuilder
      entryRoleView={dataset.dataview.role_view_name}
      role={data}
      dataset={dataset}
    />
  );
}

interface DataBuilderProps {
  entryRoleView: string;
  role: TablesConfiguration<'role'>;
  dataset: DatasetOutput;
}

const DataBuilder = ({ entryRoleView, dataset }: DataBuilderProps) => {
  const queryClient = useQueryClient();
  const { environment_schema, configuration_schema } = useEnvironment();
  const datasetCacheKey = [
    ['dataset', 'dataset'],
    {
      input: {
        datasetId: dataset.id,
      },
      type: 'query',
    },
  ];

  const { data } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('role_view')
      .select(
        `
          *,
          role_column!role_column_configuration_schema_role_view_name_fkey(
            *,
            role_link!role_link_configuration_schema_source_view_name_source_col_fkey(*)
          )
        `
      )
      .in('name', dataset.roleViews ?? [])
  );

  const insertDataViewRelation =
    trpc.dataset.insertDataViewRelation.useMutation({
      onSuccess: values => {
        queryClient.setQueryData(datasetCacheKey, () => {
          return values;
        });
      },
      onError: () => {
        toast.error('Unable to create relation.');
      },
    });

  const { mutate: upsertColumn } = useUpsertMutation(
    postgrest.schema(environment_schema).from('dataview_column'),
    ['id'],
    '*',
    {
      onSuccess: (
        columns:
          | Database['configuration']['Tables']['dataview_column']['Row'][]
          | null
      ) => {
        queryClient.setQueryData(
          datasetCacheKey,
          (previousDataset: DatasetOutput) => {
            console.log({ columns, previousDataset, datasetCacheKey });
            if (columns)
              for (const column of columns) {
                const view = findDataviewById(
                  previousDataset,
                  column.parent_dataview_id
                );
                console.log({ view });
                if (view) {
                  view.dataview_column =
                    view.dataview_column?.filter(
                      existingColumn => existingColumn.id !== column.id
                    ) ?? [];
                  view.dataview_column.push({
                    ...column,
                    child_dataview: null,
                  });
                }
              }
            console.log({ previousDataset });
            return { ...previousDataset };
          }
        );
      },
    }
  );

  const { mutate: deleteColumn } = useDeleteMutation(
    postgrest.schema(environment_schema).from('dataview_column'),
    ['id'],
    '*',
    {
      onSuccess: (
        column:
          | Database['configuration']['Tables']['dataview_column']['Row']
          | null
      ) => {
        queryClient.setQueryData(
          datasetCacheKey,
          (
            previousDataset: inferRouterOutputs<AppRouter>['dataset']['dataset']
          ) => {
            if (column) {
              const view = findDataviewById(
                previousDataset,
                column.parent_dataview_id
              );
              if (view) {
                view.dataview_column =
                  view.dataview_column?.filter(
                    existingColumn => existingColumn.id !== column.id
                  ) ?? [];
              }
            }
            return { ...previousDataset };
          }
        );
      },
    }
  );

  const { mutate: deleteDataview } = useDeleteMutation(
    postgrest.schema(environment_schema).from('dataview'),
    ['id'],
    '*',
    {
      onSuccess: (dataview: TablesConfiguration<'dataview'> | null) => {
        queryClient.setQueryData(
          datasetCacheKey,
          (previousDataset: DatasetOutput) => {
            if (dataview?.id) {
              const result = findParentColumnOfDataviewById(
                previousDataset,
                dataview.id
              );
              if (result) {
                result.parentDataview.dataview_column =
                  result.parentDataview.dataview_column?.filter(
                    column => column.id !== result.columnId
                  ) ?? null;
              }
            }
            return { ...previousDataset };
          }
        );
      },
    }
  );

  const dataview = dataset.dataview!;

  const map = data?.reduce(
    (
      accumulator: Record<string, NonNullable<typeof data>[number]>,
      current
    ) => {
      return { ...accumulator, [current.name!]: current };
    },
    {}
  );

  if (!map?.[dataview.role_view_name]) {
    return <LoadingPage message="Building tree" />;
  }

  const buildDataviewItem = ({
    roleViewMap,
    dataview,
    linkName,
    isRoot,
  }: {
    roleViewMap: Record<string, NonNullable<typeof data>[number]>;
    dataview: DataviewOutput;
    linkName?: string;
    isRoot?: boolean;
  }): TreeDataItem => {
    const roleView = roleViewMap[dataview.role_view_name];

    return {
      id: dataview.role_view_name,
      name: (
        <div className="flex items-center space-x-2 text-center">
          <Badge className="flex space-x-2">
            <p>{dataview.role_view_name} </p>{' '}
            <CheckCircle width={12} height={12} />
          </Badge>
          {linkName ? (
            <Badge className="flex space-x-2" variant="secondary">
              <Link width={12} height={12} />
              <p>{linkName}</p>
            </Badge>
          ) : null}
        </div>
      ),
      actions: isRoot ? undefined : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-6 w-6 p-1"
              variant="destructive"
              onClick={() => {
                deleteDataview({
                  id: dataview.id,
                });
              }}
            >
              <DiamondMinus width={12} height={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={5}>
            Delete Entity
          </TooltipContent>
        </Tooltip>
      ),
      children: roleView?.role_column
        .map((role_column, columnIndex) => {
          const isForeignKey = role_column.role_link.length > 0;
          const currentColumn = dataview.dataview_column?.find(
            dataview_column =>
              dataview_column.role_column_name === role_column.name &&
              !dataview_column.child_dataview_id
          );
          return {
            id: role_column.name!,
            name: (
              <div className="flex items-center space-x-2 text-center">
                <p>{role_column.name!}</p>
                {currentColumn ? (
                  <CheckCircle
                    className="text-green-600"
                    width={12}
                    height={12}
                  />
                ) : null}
              </div>
            ),
            icon: RectangleEllipsis,
            actions: (
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="m-0 h-6 w-6 p-1"
                      variant={currentColumn ? 'destructive' : 'default'}
                      onClick={e => {
                        e.preventDefault();
                        const payload = {
                          parent_dataview_id: dataview.id,
                          // child_dataview_id: dataview.id,
                          role_column_name: role_column.name!,
                          role_view_name: dataview.role_view_name,
                          configuration_schema,
                          order: columnIndex,
                        } satisfies Database['configuration']['Tables']['dataview_column']['Insert'];
                        if (currentColumn) {
                          deleteColumn({
                            id: currentColumn.id,
                          });
                        } else {
                          upsertColumn([payload]);
                        }
                      }}
                    >
                      {currentColumn ? (
                        <MinusCircle width={12} height={12} />
                      ) : (
                        <CirclePlus width={12} height={12} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="TooltipContent" sideOffset={5}>
                    {currentColumn ? 'Remove column' : 'Add column'}
                  </TooltipContent>
                </Tooltip>
              </div>
            ),
            children: isForeignKey
              ? role_column.role_link.map(role_link => {
                  const columnWithDataview = dataview.dataview_column?.find(
                    childColumn =>
                      childColumn.child_dataview?.role_view_name ===
                        role_link.target_view_name &&
                      childColumn.child_dataview.constraint ===
                        role_link.constraint
                  );

                  return columnWithDataview?.child_dataview
                    ? buildDataviewItem({
                        dataview: columnWithDataview.child_dataview,
                        roleViewMap,
                        linkName: role_link.display_name ?? undefined,
                      })
                    : {
                        id: JSON.stringify(role_link),
                        icon: Link,
                        name: (
                          <Badge variant="outline">
                            {`${role_link.type}`} &rarr;{' '}
                            {`${role_link.target_view_name} via ${role_link.target_column_name}`}
                          </Badge>
                        ),
                        actions: (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="h-6 w-6 p-1"
                                variant="outline"
                                onClick={() => {
                                  insertDataViewRelation.mutate({
                                    dataset_id: dataset.id,
                                    role_view_name: role_link.source_view_name!,
                                    parent_dataview_id: dataview.id,
                                    constraint: role_link.constraint!,
                                    related_role_view_name:
                                      role_link.target_view_name!,
                                    role_column_name:
                                      role_link.source_column_name!,
                                  });
                                }}
                              >
                                <DiamondPlus width={12} height={12} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="TooltipContent"
                              sideOffset={5}
                            >
                              Add Entity
                            </TooltipContent>
                          </Tooltip>
                        ),
                      };
                })
              : undefined,
          };
        })
        .sort((a, b) => {
          // First, sort by whether children is undefined
          if (a.children === undefined && b.children !== undefined) {
            return -1;
          }
          if (a.children !== undefined && b.children === undefined) {
            return 1;
          }

          // Then, sort by length of name
          const nameLengthDifference = a.id.length - b.id.length;
          if (nameLengthDifference !== 0) {
            return nameLengthDifference;
          }

          // If both name lengths are equal, sort by the length of children
          return (a.children?.length ?? 0) - (b.children?.length ?? 0);
        }),
    };
  };

  return (
    <TreeView
      className="overflow-auto"
      data={[buildDataviewItem({ roleViewMap: map, dataview, isRoot: true })]}
      expandAll
      defaultLeafIcon={RectangleEllipsis}
      leafClassName="hover:bg-accent/20 rounded-lg"
      initialSelectedItemId={entryRoleView}
    />
  );
};
