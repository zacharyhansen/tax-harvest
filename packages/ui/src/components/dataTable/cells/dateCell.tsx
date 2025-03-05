import type { CellContext } from '@tanstack/react-table';
import { formatDate } from 'utilities';
import { cn } from 'ui/shadcn/lib/utils';

export default function DateCell<TData, TValue>({
  getValue,
}: CellContext<TData, TValue>) {
  if (!getValue()) {
    return null;
  }

  return (
    <div className={cn('font-medium')}>
      {formatDate(getValue<string | Date | null | undefined>())}
    </div>
  );
}
