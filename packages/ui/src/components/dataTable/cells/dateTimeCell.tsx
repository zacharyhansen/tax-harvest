import { cn } from '@repo/ui/utils/cn';
import { DateFormatter } from '@repo/ui/utils/date-formatter';
import type { CellContext } from '@tanstack/react-table';

export default function DateTimeCell<TData, TValue>({
	getValue,
}: CellContext<TData, TValue>) {
	if (!getValue()) {
		return null;
	}

	return (
		<div className={cn('font-medium')}>
			{DateFormatter.timestamp(getValue<string | Date | null | undefined>())}
		</div>
	);
}
