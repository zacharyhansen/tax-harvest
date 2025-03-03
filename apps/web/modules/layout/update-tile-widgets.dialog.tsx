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
import {
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useCallback, useMemo, type ReactNode } from 'react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { toast } from '@repo/ui/components/toast-sonner';

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

interface UpdateTileWidgetsProps {
  children: ReactNode;
  widgets: TablesConfiguration<'widget'>[];
}

export default function UpdateTileWidgets({
  widgets,
  children,
}: Readonly<UpdateTileWidgetsProps>) {
  const { environment_schema } = useEnvironment();
  const { mutateAsync: upsertTile } = useUpsertMutation(
    postgrest.schema(environment_schema).from('widget'),
    ['id'],
    '*',
    {
      onError: error => {
        console.error({ error });
        toast.error('Failed to update the widget(s).');
      },
      revalidateTables: [
        {
          schema: environment_schema,
          table: 'layout',
        },
      ],
    }
  );

  const { mutate: updateWidget } = useUpdateMutation(
    postgrest.schema(environment_schema).from('widget'),
    ['id'],
    '*',
    {
      onError: error => {
        console.error({ error });
        toast.error('Failed to update the widget(s).');
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
    }: CellValueChangedEvent<TablesConfiguration<'widget'>>) => {
      if (colDef.field) {
        updateWidget({
          id: data.id,
          [colDef.field]: newValue,
        });
      }
    },
    [updateWidget]
  );

  const columnDefs: ColDef<TablesConfiguration<'widget'>>[] = useMemo(
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
    ],
    []
  );

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="md:min-w-[90%]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Manage Widgets</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogDescription>
          Change the order and attributes of each widget.
        </ResponsiveDialogDescription>
        <ResponsiveDialogBody>
          <AgGridWrapper height={300}>
            <AgGridReact<TablesConfiguration<'widget'>>
              dataTypeDefinitions={dataTypeDefinitions}
              rowData={widgets}
              onCellValueChanged={handleCellEdit}
              columnDefs={columnDefs}
              rowDragManaged
              gridOptions={themeQuartzGridOptions}
              onRowDragEnd={event => {
                const upserts: TablesConfigurationInsert<'widget'>[] = [];
                event.api.forEachLeafNode(node => {
                  if (node.data) {
                    const newWidget = {
                      ...node.data,
                      order: node.rowIndex! + 1,
                    } satisfies TablesConfigurationInsert<'widget'>;
                    // @ts-expect-error have to get rid of relation
                    delete newWidget.published_component_on_widget;
                    upserts.push(newWidget);
                  }
                });
                toast.promise(upsertTile(upserts), {
                  loading: 'Reordering widgets...',
                  success: 'Widgets reordered successfully',
                  error: 'Failed to reorder widgets',
                });
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
