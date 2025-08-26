import { cn } from '@repo/ui/utils/cn';
import type { CellContext } from '@tanstack/react-table';

export default function MoneyCell<TData, TValue>({
	colored = true,
	getValue,
	value,
}: CellContext<TData, TValue> & {
	colored?: boolean;
	value?: string | number;
}) {
	if (!getValue() && value === undefined) {
		return null;
	}

	const cellValue = Number(value ?? getValue());

	const formatted = new Intl.NumberFormat('en-US', {
		currency: 'USD',
		style: 'currency',
		maximumFractionDigits: 2,
	}).format(cellValue);

	return (
		<div
			className={cn({
				'text-green-600': colored && cellValue > 0,
				'text-red-600': colored && cellValue < 0,
			})}
		>
			{formatted}
		</div>
	);
}
