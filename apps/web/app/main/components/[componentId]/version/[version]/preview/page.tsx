'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

import { useEnvironment } from '~/app/main/environment.provider';
import postgrest from '~/lib/database/postgrest';
import type { TypedRoutes } from '~/lib/routes';
import { FormComponent, TableComponent, useDataset } from '~/modules/dataset';
import { LoadingIcon, ErrorPage } from '~/modules/utility-components';

interface PreviewPageProps {
  params: typeof TypedRoutes.componentPreview.params;
}

export default function Page({
  params: { componentId, version },
}: Readonly<PreviewPageProps>) {
  const { environment_schema } = useEnvironment();
  const { dataset } = useDataset();
  const {
    data: component,
    isLoading,
    error,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component_version')
      .select('*')
      .eq('component_id', componentId)
      .eq('version', version)
      .single()
  );

  if (isLoading) {
    return <LoadingIcon className="m-auto" />;
  }

  if (error) {
    return <ErrorPage message="There was an issue loading the dataset." />;
  }

  if (!component) {
    return <ErrorPage message="There was an issue loading the dataset." />;
  }

  return component.type === 'form' ? (
    <FormComponent datasetId={dataset.id} />
  ) : (
    <TableComponent datasetId={dataset.id} />
  );
}
