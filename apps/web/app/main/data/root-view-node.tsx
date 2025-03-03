import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
} from '@repo/ui/components/reponsive-dialog';
import type { MasterView } from '@repo/utils/src/lib/data-tree';
import { InfoIcon, SquareArrowOutUpRight } from 'lucide-react';
import { memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import type { AgGridReact } from 'ag-grid-react';
import type { IRowNode } from 'ag-grid-community';
import { toast } from '@repo/ui/components/toast-sonner';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { capitalCase } from 'change-case';

import ViewDetail from './view-detail';

import { trpc } from '~/lib/trpc';

interface MasterViewNodeProps {
  data: {
    view: MasterView;
    hasParent: boolean;
  };
}

const toastId = 'View Update';

function RootViewNode({ data }: Readonly<MasterViewNodeProps>) {
  const label = data.view.label ?? data.view.name;
  const gridReference = useRef<AgGridReact>(null);
  const mutation = trpc.view.mutateViewsForRoles.useMutation({
    onMutate: () => {
      toast.loading('Applying changes', { id: toastId });
    },
    onSuccess: () => {
      toast.success('System has been updated.', { id: toastId });
    },
    onError: () => {
      toast.error('There was an error applying your changes.', { id: toastId });
    },
  });

  return (
    <div className="bg-background flex h-[fit] w-[300] flex-col items-center justify-center rounded-lg border p-2 shadow-sm">
      <Badge className="m-2 font-semibold capitalize">{label}</Badge>
      <div className="text-secondary-foreground text-center">
        {data.view.description}
      </div>
      <ResponsiveDialog>
        <ResponsiveDialogTrigger asChild>
          <Button
            variant="link"
            iconRight={<SquareArrowOutUpRight size={12} />}
          >
            Manage Columns
          </Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              Manage data for {capitalCase(label)}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Enabling or disabling the fields within this model will remove or
              add permissions for the current role to access and view the data.
              <Alert variant="info">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  Use the spacebar to check or uncheck columns. Primary keys
                  will be automatically added when at least one column is
                  enabled. This is required to allow proper use across
                  api&apos;s and ui&apos;s for the system.
                </AlertDescription>
              </Alert>
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody className="h-[55vh]">
            {/* Moved to its own component so we only fire the wuries once the modal is opened */}
            <ViewDetail name={data.view.name} gridReference={gridReference} />
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="secondary">Close</Button>
            </ResponsiveDialogClose>
            <Button
              disabled={mutation.isPending}
              loading={mutation.isPending}
              onClick={() => {
                const updatedData: ({
                  name: string;
                  id: string;
                  view_id: string;
                } & Record<string, string | boolean>)[] = [];
                gridReference.current?.api.forEachNode((node: IRowNode) => {
                  updatedData.push(node.data);
                });
                const rootViewId = updatedData[0]?.view_id;
                if (!rootViewId) {
                  return;
                }
                mutation.mutate({
                  tableName: data.view.name,
                  columnEnabledRecords: updatedData,
                  rootViewId,
                });
              }}
            >
              Apply Changes
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      {data.hasParent ? (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-primary w-16"
          isConnectable={data.hasParent}
        />
      ) : null}
      {data.view.children ? (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-primary w-16"
          isConnectable={!!data.view.children}
        />
      ) : null}
    </div>
  );
}

export default memo(RootViewNode);
