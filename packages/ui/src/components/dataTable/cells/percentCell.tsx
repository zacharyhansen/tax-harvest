import { cn } from '@repo/ui/utils/cn';
import type { CellContext } from '@tanstack/react-table';

export default function PercentCell<TData, TValue>({
	colored = true,
	getValue,
	value,
}: CellContext<TData, TValue> & {
	colored?: boolean;
	value?: number;
}) {
	if (!getValue() && value === undefined) {
		return null;
	}

	const amount = (value ?? Number.parseFloat(String(getValue()))) / 100;
	const formatted = new Intl.NumberFormat('en-US', {
		maximumFractionDigits: 2,
		style: 'percent',
	}).format(amount);

	return (
		<div
			className={cn('font-medium', {
				'text-green-600': colored && amount > 0,
				'text-red-600': colored && amount < 0,
			})}
		>
			{formatted}
		</div>
	);
}
