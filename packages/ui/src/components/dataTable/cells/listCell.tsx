import { cn } from '@repo/ui/utils/cn';
import type { CellContext } from '@tanstack/react-table';

export default function ListCell<TData, TValue>({
	getValue,
}: CellContext<TData, TValue>) {
	if (!getValue()) {
		return null;
	}
	const accounts = getValue() as [];

	return (
		<div className={cn('font-extralight')}>
			{accounts.map((account) => (
				<div key={account}>{account}</div>
			))}
		</div>
	);
}
