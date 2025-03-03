'use client';

import type React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

import { useEnvironment } from '../../environment.provider';

import postgrest from '~/lib/database/postgrest';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import type { TypedRoutes } from '~/lib/routes';

export default function TabbedPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: typeof TypedRoutes.dataset.params;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { environment_schema } = useEnvironment();
  const tabs = [
    { name: 'Builder', href: `builder` },
    { name: `Query Config`, href: `configuration` },
    { name: 'Table Configuration', href: `table-columns` },
    { name: 'Form Configuration', href: `form` },
    { name: `Preview`, href: `preview` },
    { name: `Settings`, href: `settings` },
  ];

  const {
    data: dataset,
    isLoading: isLoadingDataset,
    error,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('dataset')
      .select(
        `
         *,
        dataview!dataset_dataview_id_fkey(
          id,
          role_view_name
        ),
        auth_user!dataset_created_by_id_fkey(
          clerk_id,
          name,
          email
        ),
        dataset!dataset_dataset_id_fkey(
          id,
          name,
          description,
          created_at
        )
        `
      )
      .eq('id', params.datasetId)
      .single()
  );

  if (error) {
    console.error({ error });
    return <ErrorPage message="Dataset Error" />;
  }

  if (isLoadingDataset || !dataset) {
    return <LoadingPage message="Fetching dataset" />;
  }

  return (
    <PageWrapper title={dataset.id} description={dataset.description}>
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
    </PageWrapper>
  );
}
