'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useRouter } from 'next/navigation';

import { useEnvironment } from '../../environment.provider';

import postgrest from '~/lib/database/postgrest';
import { LoadingPage } from '~/modules/utility-components';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';

interface PageProps {
  params: typeof TypedRoutes.component.params;
}

export default function Page({ params: { componentId } }: PageProps) {
  const { environment_schema } = useEnvironment();
  const router = useRouter();
  const { data } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component_version')
      .select('version')
      .eq('component_id', componentId)
      .order('version', { ascending: false })
  );

  if (data) {
    router.push(
      TypedRoutes.componentVersion({
        componentId,
        version: data[0]?.version ?? 1,
      })
    );
  }

  return (
    <PageWrapper>
      <LoadingPage message="Retreiving current component" />
    </PageWrapper>
  );
}
