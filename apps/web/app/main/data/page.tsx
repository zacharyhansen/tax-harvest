'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useMemo } from 'react';

import EntityFlow, { autoLayout } from './entity-flow';

import postgrest from '~/lib/database/postgrest';
import { LoadingPage } from '~/modules/utility-components';
import type { TablesFoundation } from '~/lib/database/helpers';
import { LayoutWrapper } from '~/modules/layout';

export default function Page() {
  const currnetTable = '_p_deal';
  const { data, isLoading } = useQuery(
    postgrest
      .schema('foundation')
      .from('view')
      .select(
        `
      name,
      type,
      pg_primary_table,
      pgt_updatable,
      column!column_schema_view_name_fkey(
        name,
        data_type,
        pgt_nominal_type,
        pgt_type,
        pgt_max_len,
        is_unique,
        pgt_nullable,
        pgt_description,
        pgt_default,
        pgt_enum
      ),
      link!link_schema_source_view_name_fkey!inner(
        *,
        view!link_schema_target_view_name_fkey(
          name,
          type,
          pg_primary_table,
          pgt_updatable
        )
      )
      `
      )
      .or(`source_view_name.eq.${currnetTable}`, {
        referencedTable: 'link',
      })
  );

  const autoLayoutData = useMemo(
    () =>
      autoLayout({
        nodes: (
          data?.map(view => ({
            type: view.type!,
            id: view.name!,
            data: view as unknown as TablesFoundation<'view'>,
            position: { x: 0, y: 0 },
          })) ?? []
        ).concat(
          data?.flatMap(view =>
            view.link.map(({ view }) => ({
              type: view!.type!,
              id: view!.name!,
              data: view! as TablesFoundation<'view'>,
              position: { x: 0, y: 0 },
            }))
          ) ?? []
        ),
        edges:
          data?.flatMap(view =>
            view.link.map(link => ({
              id:
                link.source_view_name! +
                link.target_view_name +
                link.constraint +
                link.constraint_2,
              source: link.source_view_name!,
              target: link.target_view_name!,
            }))
          ) ?? [],
        nodeWidth: 320,
        nodeHeight: 200,
        direction: 'LR',
      }),
    [data]
  );

  return (
    <LayoutWrapper
      title="Data Tree"
      description="Manage the permissions and data access for all roles within your instance."
    >
      {isLoading ? (
        <LoadingPage message="Retreiving schematic" />
      ) : (
        <EntityFlow autoLayout={autoLayoutData} />
      )}
    </LayoutWrapper>
  );
}
