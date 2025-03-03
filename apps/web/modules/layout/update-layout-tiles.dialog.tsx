'use client';

import { Button } from '@repo/ui/components/button';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogDescription,
  ResponsiveDialogContent,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/components/reponsive-dialog';
import { toast } from '@repo/ui/components/toast-sonner';
import { useUpsertMutation } from '@supabase-cache-helpers/postgrest-react-query';
import { useCallback, useMemo, type ReactNode } from 'react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import {
  AgGridWrapper,
  dataTypeDefinitions,
  themeQuartzGridOptions,
} from '../client-ag-grid';

import { useEnvironment } from '~/app/main/environment.provider';
import type {
  TablesConfiguration,
  TablesConfigurationInsert,
} from '~/lib/database/helpers';
import postgrest from '~/lib/database/postgrest';

interface UpdateLayoutTilesProps {
  children: ReactNode;
  tiles: TablesConfiguration<'tile'>[];
}

export default function UpdateLayoutTiles({
  tiles,
  children,
}: Readonly<UpdateLayoutTilesProps>) {
  const { environment_schema } = useEnvironment();
  const { mutate: upsertTile } = useUpsertMutation(
    postgrest.schema(environment_schema).from('tile'),
    ['id'],
    '*',
    {
      onError: error => {
        console.error({ error });
        toast.error('Failed to update the tile(s).');
      },
      revalidateTables: [
        {
          schema: environment_schema,
          table: 'layout',
        },
      ],
    }
  );

  const handleCellEdit = useCallback(
    ({
      newValue,
      data,
      colDef,
    }: CellValueChangedEvent<TablesConfiguration<'tile'>>) => {
      if (colDef.field) {
        const newTile = {
          ...data,
          [colDef.field]: newValue,
        };
        // @ts-expect-error have to get rid of realtion
        delete newTile.widget;
        upsertTile([newTile]);
      }
    },
    [upsertTile]
  );

  const columnDefs: ColDef<TablesConfiguration<'tile'>>[] = useMemo(
    () => [
      {
        field: 'label',
        width: 200,
        rowDrag: true,
        pinned: 'left',
        cellDataType: 'text',
        editable: true,
      },
      {
        field: 'description',
        minWidth: 200,
        flex: 1,
        editable: true,
        cellDataType: 'text',
      },
      {
        headerName: 'Default Open?',
        field: 'default_open',
        editable: true,
      },
      {
        field: 'grid_start',
        editable: true,
      },
      {
        field: 'grid_end',
        editable: true,
      },
      {
        field: 'height',
        editable: true,
      },
    ],
    []
  );

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="md:min-w-[90%]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Manage Tiles</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogDescription>
          Change the order and attributes of each tile.
        </ResponsiveDialogDescription>
        <ResponsiveDialogBody>
          <AgGridWrapper height={300}>
            <AgGridReact<TablesConfiguration<'tile'>>
              dataTypeDefinitions={dataTypeDefinitions}
              rowData={tiles}
              onCellValueChanged={handleCellEdit}
              columnDefs={columnDefs}
              rowDragManaged
              getRowId={row => row.data.id}
              gridOptions={themeQuartzGridOptions}
              onRowDragEnd={event => {
                const upserts: TablesConfigurationInsert<'tile'>[] = [];
                event.api.forEachLeafNode(node => {
                  if (node.data) {
                    const newTile = {
                      ...node.data,
                      order: node.rowIndex!,
                    } satisfies TablesConfigurationInsert<'tile'>;
                    // @ts-expect-error have to get rid of relation
                    delete newTile.widget;
                    upserts.push(newTile);
                  }
                });
                upsertTile(upserts);
              }}
            />
          </AgGridWrapper>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline">Close</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
