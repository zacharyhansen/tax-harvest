import type { CellContext } from '@tanstack/react-table';

import type { BadgeProps } from '../../../index';
import { Badge } from '../../../index';

export default function BadgeCell<TData, TValue>({
  getValue,
  ...props
}: CellContext<TData, TValue> & BadgeProps) {
  return getValue() ? (
    <Badge variant="outline" {...props}>
      {getValue<string | null>()}
    </Badge>
  ) : null;
}
