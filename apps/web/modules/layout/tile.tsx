'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Expand,
  TableProperties,
  Info,
  Pencil,
  SquarePlus,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { Button } from '@repo/ui/components/button';
import { useDeleteMutation } from '@supabase-cache-helpers/postgrest-react-query';
import { toast } from '@repo/ui/components/toast-sonner';
import { cn } from '@repo/ui/utils';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';

import UpsertTile from './upsert-tile.modal';
import UpsertWidget from './upsert-widget.modal';
import UpdateTileWidgets from './update-tile-widgets.dialog';
import Widget from './widget';

import type { TablesConfiguration } from '~/lib/database/helpers';
import postgrest from '~/lib/database/postgrest';
import { useEnvironment } from '~/app/main/environment.provider';
import { useUser } from '~/app/main/user.provider';

export interface TileProps {
  tile: TablesConfiguration<'tile'> & {
    widget: TablesConfiguration<'widget'>[];
  };
  layout: TablesConfiguration<'layout'> & {
    tile: TablesConfiguration<'tile'>[];
  };
  onEdit?: VoidFunction;
}

export function Tile({ tile, layout, onEdit }: Readonly<TileProps>) {
  const { environment_schema } = useEnvironment();
  const { isConfiguring } = useUser();
  const { label, description } = tile;
  const [isCollapsed, setIsCollapsed] = useState(!tile.default_open);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const deleteTile = useDeleteMutation(
    postgrest.schema(environment_schema).from('tile'),
    ['id'],
    'id',
    {
      onSuccess: () => {
        toast.success('Deleted');
      },
      revalidateTables: [
        {
          schema: environment_schema,
          table: 'layout',
        },
      ],
    }
  );

  const deleteWidget = useDeleteMutation(
    postgrest.schema(environment_schema).from('widget'),
    ['id'],
    'id',
    {
      onSuccess: () => {
        toast.success('Deleted');
      },
      onError: error => {
        console.error('Unable to delete widget.', error);
        toast.error('Unable to delete widget.');
      },
      revalidateTables: [
        {
          schema: environment_schema,
          table: 'layout',
        },
      ],
    }
  );

  return (
    <div
      id={tile.id}
      className={cn('bg-background h-fit rounded-lg border shadow-sm')}
    >
      <div
        className={cn('flex items-center justify-between p-1 px-4', {
          'border-b': !isCollapsed,
        })}
      >
        <div className="flex items-center">
          {description ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    {label && (
                      <h2 className="text-lg font-semibold">{label}</h2>
                    )}
                    <Info className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : label ? (
            <h2 className="text-lg font-semibold">{label}</h2>
          ) : null}
        </div>
        <div className="flex items-center space-x-1">
          {isConfiguring ? (
            <>
              <UpsertTile layout={layout} existingTile={tile}>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </UpsertTile>
              <UpdateTileWidgets widgets={tile.widget}>
                <Button variant="ghost" size="icon">
                  <TableProperties className="h-4 w-4" />
                </Button>
              </UpdateTileWidgets>
              <UpsertWidget tile={tile} onSuccess={onEdit}>
                <Button variant="ghost" size="icon">
                  <SquarePlus className="h-4 w-4" />
                </Button>
              </UpsertWidget>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Tile?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => {
                        deleteTile.mutate({
                          id: tile.id,
                        });
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
          <ResponsiveDialog>
            <ResponsiveDialogTrigger asChild>
              <Button variant="link" size="icon">
                <Expand className="h-4 w-4" />
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent className="max-w-fit">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>{label}</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  {description}
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogBody className="h-[80vh] w-[90vw] overflow-auto">
                {tile.widget.length > 1 ? (
                  <Tabs
                    defaultValue={tile.widget[0]?.id}
                    className="flex h-full flex-col"
                  >
                    <TabsList>
                      {tile.widget.map(widget => (
                        <TabsTrigger
                          key={widget.id}
                          value={widget.id}
                          className="min-w-24"
                        >
                          {widget.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {tile.widget.map(widget => (
                      <TabsContent
                        key={widget.id}
                        value={widget.id}
                        className="mt-0 flex-grow"
                      >
                        <Widget widget={widget} />
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : tile.widget.length > 0 ? (
                  tile.widget.map(widget => (
                    <Widget key={widget.id} widget={widget} />
                  ))
                ) : null}
              </ResponsiveDialogBody>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose asChild>
                  <Button>Close</Button>
                </ResponsiveDialogClose>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div
        className={cn('transition-[height] duration-300 ease-in-out', {
          'h-96': !isCollapsed,
          'h-0': isCollapsed,
          'overflow-hidden': true,
        })}
      >
        <div className="h-full overflow-auto px-4 py-2">
          {tile.widget.length > 1 ? (
            <Tabs
              defaultValue={tile.widget[0]?.id}
              className="flex h-full flex-col"
            >
              <TabsList className="justify-start">
                {tile.widget.map(widget => (
                  <TabsTrigger
                    key={widget.id}
                    value={widget.id}
                    className="s flex min-w-24 items-center"
                  >
                    <p>{widget.label}</p>
                    {isConfiguring && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-destructive"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Widget?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => {
                                deleteWidget.mutate({
                                  id: widget.id,
                                });
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tile.widget.map(widget => (
                <TabsContent
                  key={widget.id}
                  value={widget.id}
                  className="mt-0 flex-grow"
                >
                  <Widget widget={widget} />
                </TabsContent>
              ))}
            </Tabs>
          ) : tile.widget.length > 0 ? (
            tile.widget.map(widget => (
              <Widget key={widget.id} widget={widget} />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
