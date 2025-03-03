'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import {
  useDeleteMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useEffect, useState } from 'react';
import {
  Copy,
  Ellipsis,
  Layout,
  Pencil,
  Send,
  TableProperties,
  Trash2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { Alert } from '@repo/ui/components/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Badge } from '@repo/ui/components/badge';
import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@repo/ui/components/alert-dialog';

import { Tile } from './tile';
import UpsertTile from './upsert-tile.modal';
import PageWrapper from './page-wrapper';
import UpsertLayout from './update-layout.dialog';
import UpdateLayoutTiles from './update-layout-tiles.dialog';
import PageWrapperWithNav, { PageNavTitle } from './page-wrapper-with-nav';

import { useEnvironment } from '~/app/main/environment.provider';
import { useUser } from '~/app/main/user.provider';
import type { LayoutSlug } from '~/lib/constants/layout.slugs';
import postgrest from '~/lib/database/postgrest';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
export interface LayoutBuilderProps {
  slug: LayoutSlug;
}

export default function LayoutBuilder({ slug }: Readonly<LayoutBuilderProps>) {
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>();
  const { environment_schema, configuration_schema } = useEnvironment();
  const { user } = useUser();
  const {
    data: layoutVersions,
    isLoading: isLoadingLayoutVersions,
    error: errorLayoutVersions,
    refetch: refetchLayoutVersions,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component_version')
      .select(
        `
        version,
        component_id,
        layout(
          id,
          updated_at
        ),
        published_component(
            environment_schema,
            published_at,
            auth_user(
              email,
              name
            )
          )
        `
      )
      .order('version', { ascending: false })
      .eq('slug', slug)
      .eq('role_name', user.role_name)
  );

  useEffect(() => {
    if (layoutVersions?.length) {
      setSelectedLayoutId(layoutVersions[0]?.layout?.id);
    }
  }, [layoutVersions]);

  const {
    data: selectedLayout,
    error: errorSelectedLayout,
    isLoading: selectedLayoutLoading,
    refetch: refetchLayout,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('layout')
      .select(
        `
        *,
        component_version(
          version,
          component_id
        ),
        tile(*,
          widget(*,
            published_component_on_widget(*,
              published_component(*, 
                component_version(*,
                  table(*),
                  form(*)
                )
              )
            )
          )
        )
      `
      )
      .eq('id', selectedLayoutId ?? '')
      .order('order', { referencedTable: 'tile', ascending: true })
      .order('order', { referencedTable: 'tile.widget', ascending: true })
      .order('order', {
        referencedTable: 'tile.widget.published_component_on_widget',
        ascending: true,
      })
      .maybeSingle(),
    { enabled: !!selectedLayoutId }
  );

  const handleDuplicateLayout = (p_version: number, p_component_id: string) => {
    void postgrest
      .schema(environment_schema)
      .rpc('component_version_duplicate', {
        p_component_id,
        p_version,
      })
      .then(result => {
        if (result.data) {
          void refetchLayoutVersions().then(() => {
            // setSelectedLayoutId(result.data.);
          });
        }
        if (result.error) {
          console.error(result.error);
          toast.error('Unable to duplicate layout');
        }
      });
  };

  const handlePublishLayout = (component_id: string, version: number) => {
    toast.promise(
      async () => {
        const { error } = await postgrest
          .schema(environment_schema)
          .from('published_component')
          .upsert(
            {
              component_id,
              version,
              slug,
              environment_schema,
              configuration_schema,
              published_by_id: user.user_id,
              published_at: new Date().toISOString(),
              role_name: user.role_name,
            },
            {
              onConflict: 'environment_schema,component_id',
              ignoreDuplicates: false,
            }
          );

        if (error) {
          console.error({ error });
          throw new Error('Failed to publish the component.');
        }
        void refetchLayoutVersions();
      },
      {
        loading: 'Publishing layout...',
        success: 'Layout published!',
        error: 'Failed to publish the layout.',
      }
    );
  };

  const handleDeleteLayout = useDeleteMutation(
    postgrest.schema(environment_schema).from('layout'),
    ['id'],
    'id',
    {
      revalidateTables: [
        { schema: environment_schema, table: 'component_version' },
        { schema: environment_schema, table: 'published_component' },
      ],
    }
  );

  if (errorLayoutVersions ?? errorSelectedLayout) {
    return <ErrorPage />;
  }

  return (
    <PageWrapperWithNav>
      {/* PAGE CONTENT */}
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {selectedLayoutLoading || isLoadingLayoutVersions ? (
          <LoadingPage />
        ) : !selectedLayout ? (
          <UpsertLayout slug={slug} onSuccess={refetchLayoutVersions}>
            <div className="text-card-foreground m-auto grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
              <div className="text-center">
                <div className="text-primary flex justify-center space-x-2 align-middle text-xl font-bold">
                  Create your custom layout
                </div>
                <div className="max-w-lg text-sm text-gray-600">
                  Manage layout attributes, make modifications, and publish new
                  versions for your users. Non configurator users will only see
                  the published version - only one version can be published at a
                  time per environment. Editing a published version will have
                  immediate effects for end users.
                </div>
                <div className="mt-4 flex items-center justify-center gap-x-6">
                  <Button iconLeft={<Layout />} className="">
                    Create Layout
                  </Button>
                </div>
              </div>
            </div>
          </UpsertLayout>
        ) : (
          <div className="flex-1 rounded-lg border">
            <PageWrapper
              title={
                <div className="flex w-full">
                  <div>{selectedLayout.label}</div>
                  <div className="ml-auto flex space-x-2">
                    <UpsertLayout
                      slug={slug}
                      existingLayout={selectedLayout}
                      onSuccess={refetchLayoutVersions}
                    >
                      <Button variant="ghost" size="icon" className="-mt-2">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </UpsertLayout>
                    <UpdateLayoutTiles tiles={selectedLayout.tile}>
                      <Button variant="ghost" size="icon" className="-mt-2">
                        <TableProperties className="h-4 w-4" />
                      </Button>
                    </UpdateLayoutTiles>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive -mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Layout?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          This action cannot be undone. This will delete the
                          layout and all associated tiles.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() =>
                              toast.promise(
                                handleDeleteLayout.mutateAsync({
                                  id: selectedLayout.id,
                                }),
                                {
                                  loading: 'Deleting layout...',
                                  success: 'Layout deleted',
                                  error: 'Failed to delete the layout.',
                                }
                              )
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              }
              description={selectedLayout.description}
              layout={selectedLayout}
              layoutSlug={slug}
              height="100%"
            >
              <div className="flex flex-col space-y-2">
                {selectedLayout.tile.map(tile => (
                  <Tile
                    key={tile.id}
                    tile={tile}
                    onEdit={refetchLayout}
                    layout={selectedLayout}
                  />
                ))}
                <UpsertTile layout={selectedLayout}>
                  <Button className="w-full" variant="link">
                    Add Tile
                  </Button>
                </UpsertTile>
              </div>
            </PageWrapper>
          </div>
        )}
      </div>

      {/* NAV */}
      <div>
        <PageNavTitle>Versions</PageNavTitle>
        <ul className="space-y-2">
          {layoutVersions?.length ? (
            layoutVersions.map(
              ({ version, published_component, layout, component_id }) => (
                <li
                  key={version}
                  className="flex w-full items-center space-x-1"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        disabled={!!published_component.length}
                        variant={published_component.length ? 'link' : 'ghost'}
                        onClick={() =>
                          handlePublishLayout(component_id!, version!)
                        }
                      >
                        <Send size={12} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Publish</p>
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    variant={
                      selectedLayoutId === layout?.id ? 'default' : 'ghost'
                    }
                    className="flex flex-1 items-center space-x-2"
                    onClick={() => setSelectedLayoutId(layout?.id ?? '')}
                  >
                    <span>v{version}</span>
                    {published_component.length ? (
                      <Badge>Published</Badge>
                    ) : null}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ellipsis size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => {
                            handleDuplicateLayout(version!, component_id!);
                          }}
                        >
                          <Copy />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              )
            )
          ) : (
            <Alert variant="info" className="text-center">
              No layouts have been created for this role yet
            </Alert>
          )}
        </ul>
      </div>
    </PageWrapperWithNav>
  );
}
