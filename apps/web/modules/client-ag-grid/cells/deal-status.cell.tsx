import type { CustomCellRendererProps } from 'ag-grid-react';
import { Badge } from '@repo/ui/components/badge';

import type { TablesFoundation } from '~/lib/database/helpers';

export default function DealStatusCell({
  value,
}: CustomCellRendererProps<unknown, TablesFoundation<'deal_state'>> & {
  statusCount?: number;
}) {
  const { id, label } = value ?? {};

  if (id === undefined) return null;

  return <Badge>{label}</Badge>;
}
