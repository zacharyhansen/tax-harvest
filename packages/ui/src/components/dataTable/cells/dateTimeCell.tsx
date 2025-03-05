import type { CellContext } from '@tanstack/react-table';
import { formatDate } from 'utilities';
import { cn } from 'ui/shadcn/lib/utils';

export default function DateTimeCell<TData, TValue>({
  getValue,
}: CellContext<TData, TValue>) {
  if (!getValue()) {
    return null;
  }

  return (
    <div className={cn('font-medium')}>
      {formatDate(
        getValue<string | Date | null | undefined>(),
        new Intl.DateTimeFormat(undefined, {
          day: 'numeric',
          fractionalSecondDigits: 2,
          hour: 'numeric',
          minute: 'numeric',
          month: 'numeric',
          second: 'numeric',
          year: 'numeric',
        })
      )}
    </div>
  );
}
