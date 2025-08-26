'use client';

import ReactJsonView from '@microlink/react-json-view';
import { Button } from '@repo/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/ui/components/dialog';
import type { ICellRendererParams } from 'ag-grid-community';
import { useTheme } from 'next-themes';

type JsonCellProps = {
	value: unknown;
	readOnly?: boolean;
} & ICellRendererParams;

export default function JsonCell({ value }: Readonly<JsonCellProps>) {
	const theme = useTheme();

	const formattedValue = (() => {
		try {
			const parsed = typeof value === 'string' ? JSON.parse(value) : value;
			// For display in the cell, show a summarized version
			if (typeof parsed === 'object' && parsed !== null) {
				if (Array.isArray(parsed)) {
					return `[Array: ${parsed.length} items]`;
				}
				return `{Object: ${Object.keys(parsed).length} properties}`;
			}
			return String(value);
		} catch {
			return String(value);
		}
	})();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="link"
					className="size-full justify-start overflow-hidden text-ellipsis px-0 text-left font-mono text-xs"
				>
					{formattedValue}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>JSON Data</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<ReactJsonView
						src={value as JSON}
						theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
						displayDataTypes={false}
						indentWidth={6}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
