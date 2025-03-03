'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Alert } from '@repo/ui/components/alert';
import { useEffect } from 'react';

import { ErrorPage, LoadingPage } from '../utility-components';

import LayoutBuilder from './layout-builder';
import type { PageWrapperProps } from './page-wrapper';
import PageWrapper from './page-wrapper';
import { Tile } from './tile';

import { useUser } from '~/app/main/user.provider';
import type { LayoutSlug } from '~/lib/constants/layout.slugs';
import postgrest from '~/lib/database/postgrest';
import { useEnvironment } from '~/app/main/environment.provider';

interface LayoutWrapperProps extends PageWrapperProps {
  layoutSlug?: LayoutSlug;
}

export default function LayoutWrapper({
  layoutSlug,
  children,
  ...props
}: Readonly<LayoutWrapperProps>) {
  const { isConfiguring, user } = useUser();
  const { environment_schema } = useEnvironment();
  const {
    data,
    error: layoutError,
    isLoading,
    refetch,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('published_component')
      .select(
        `
        role_name,
        slug,
        component_version(
          layout(
            *,
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
          )
        )
      `
      )
      .eq('slug', layoutSlug ?? '')
      .eq('role_name', user.role_name)
      .order('order', {
        referencedTable: 'component_version.layout.tile',
        ascending: true,
      })
      .order('order', {
        referencedTable: 'component_version.layout.tile.widget',
        ascending: true,
      })
      .order('order', {
        referencedTable:
          'component_version.layout.tile.widget.published_component_on_widget',
        ascending: true,
      })
      .maybeSingle(),
    { enabled: !!layoutSlug }
  );

  const layout = data?.component_version?.layout;

  // refetch layout once user leaves configuration
  useEffect(() => {
    if (!isConfiguring) {
      void refetch();
    }
  }, [isConfiguring, refetch]);

  if (layoutError) {
    console.error({ layoutError });
    return <ErrorPage message="There was an error loading your layout" />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isConfiguring) {
    if (layoutSlug) {
      return <LayoutBuilder slug={layoutSlug} />;
    }
    return (
      <div className="p-2">
        <Alert variant="info" className="text-center">
          This page is not configurable
        </Alert>
      </div>
    );
  }

  return (
    <PageWrapper
      {...props}
      title={layout?.label ?? props.title}
      description={layout?.description ?? props.description}
    >
      {!layout ? (
        children
      ) : (
        <div className="flex min-h-full flex-col space-y-4">
          {layout.tile.map(tile => (
            <Tile key={tile.id} tile={tile} layout={layout} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
