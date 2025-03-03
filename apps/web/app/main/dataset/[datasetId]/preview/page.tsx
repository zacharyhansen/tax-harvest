'use client';

import type { TypedRoutes } from '~/lib/routes';
import { TableComponent } from '~/modules/dataset';

interface PreviewPageProps {
  params: typeof TypedRoutes.dataset.params;
}

export default function PreviewPage({
  params: { datasetId },
}: PreviewPageProps) {
  return <TableComponent datasetId={datasetId} />;
}
