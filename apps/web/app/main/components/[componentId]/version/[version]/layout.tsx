'use client';

import type React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@repo/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Copy, Ellipsis, Send } from 'lucide-react';
import { toast } from '@repo/ui/components/toast-sonner';
import { Badge } from '@repo/ui/components/badge';
import { capitalCase } from 'change-case';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';

import postgrest from '~/lib/database/postgrest';
import { PageWrapperWithNav } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { PageNavTitle } from '~/modules/layout/page-wrapper-with-nav';
import { useUser } from '~/app/main/user.provider';
import { TypedRoutes } from '~/lib/routes';
import { DatasetProvider } from '~/modules/dataset';
import { useEnvironment } from '~/app/main/environment.provider';

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: typeof TypedRoutes.componentVersion.params;
}>) {
  const safeParams = TypedRoutes.componentVersion.parse(params);
  const pathname = usePathname();
  const router = useRouter();
  const { environment_schema, configuration_schema } = useEnvironment();
  const { user } = useUser();
  const tabs = [
    { name: 'Data', href: `builder` },
    { name: 'Field Configuration', href: 'configuration' },
    { name: 'Preview', href: 'preview' },
    { name: 'Layout Links', href: 'context' },
    { name: 'Settings', href: 'settings' },
  ];

  const {
    data: component,
    isLoading: isLoadingComponentVersion,
    error,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component')
      .select(
        `
        label,
        description,
        type,
        component_version(
          version,
          component_id,
          table(
            id,
            dataset_id
          ),
          form(
            id,
            dataset_id
          )
        )
        `
      )
      .eq('id', safeParams.componentId)
      .eq('component_version.version', safeParams.version)
      .single()
  );

  const componentVersion = component?.component_version[0];

  const {
    data: componentVersions,
    isLoading: isLoadingComponentVersions,
    error: errorComponentVersions,
    refetch: refetchComponentVersions,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component_version')
      .select(
        `
        version,
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
      .eq('component_id', safeParams.componentId)
  );

  const handlePublishComponent = () => {
    toast.promise(
      async () => {
        const { error } = await postgrest
          .schema(environment_schema)
          .from('published_component')
          .upsert(
            {
              component_id: safeParams.componentId,
              version: safeParams.version,
              environment_schema,
              configuration_schema,
              role_name: user.role_name,
              published_by_id: user.user_id,
              published_at: new Date().toISOString(),
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
        void refetchComponentVersions();
      },
      {
        loading: 'Publishing component...',
        success: 'Component published!',
        error: 'Failed to publish the component.',
      }
    );
  };

  const handleVersionChange = (version: number) => {
    router.push(
      TypedRoutes.componentVersion({
        componentId: safeParams.componentId,
        version,
      })
    );
  };

  if (error ?? errorComponentVersions) {
    console.error({ error });
    return <ErrorPage message="Error loading component" />;
  }

  if (
    isLoadingComponentVersion ||
    !componentVersion ||
    isLoadingComponentVersions
  ) {
    return <LoadingPage message="Fetching component" />;
  }

  return (
    <DatasetProvider
      datasetId={
        componentVersion.table?.dataset_id ??
        componentVersion.form?.dataset_id ??
        ''
      }
    >
      <PageWrapperWithNav
        title={
          <div className="flex items-center gap-4">
            <p>{component.label}</p>
            <Badge>{capitalCase(component.type ?? '')}</Badge>
          </div>
        }
        description={component.description}
      >
        {/* PAGE CONTENT */}
        <div className="flex h-full flex-1 flex-col">
          <div className="flex w-full items-center pb-2">
            <Tabs value={pathname.split('/').pop()}>
              <TabsList>
                {tabs.map(tab => (
                  <TabsTrigger
                    key={tab.href}
                    value={tab.href}
                    onClick={() => {
                      router.push(`./${tab.href}`);
                    }}
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          {children}
        </div>

        {/* NAV */}
        <div>
          <PageNavTitle>Versions</PageNavTitle>
          <ul className="space-y-2">
            {componentVersions?.map(componentVersion => (
              <li
                key={componentVersion.version}
                className="flex w-full items-center space-x-1"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      // disabled={!!componentVersion.published}
                      variant="ghost"
                      onClick={handlePublishComponent}
                    >
                      <Send size={12} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Publish to {capitalCase(environment_schema)}</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant={
                    safeParams.version === componentVersion.version
                      ? 'default'
                      : 'outline'
                  }
                  className="flex-1"
                  onClick={() =>
                    handleVersionChange(componentVersion.version ?? 1)
                  }
                >
                  <div>v{componentVersion.version}</div>
                  {componentVersion.published_component.map(
                    publishedComponent => (
                      <Badge
                        key={publishedComponent.environment_schema}
                        className="z-10 ml-2"
                      >
                        {capitalCase(
                          publishedComponent.environment_schema ?? ''
                        )}
                      </Badge>
                    )
                  )}
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
                      // onClick={() => {
                      //   handleDuplicateLayout(version);
                      // }}
                      >
                        <Copy />
                        <span>Duplicate</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </div>
      </PageWrapperWithNav>
    </DatasetProvider>
  );
}
