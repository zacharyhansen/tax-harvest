/** biome-ignore-all lint/suspicious/noExplicitAny: <ok> */
'use client';

import { Alert } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { cn } from '@repo/ui/utils';
import type { GridApi } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { ReactElement, ReactNode } from 'react';
import { cloneElement, useCallback, useRef, useState } from 'react';
import { LoadingIcon } from '../utility-components';
import { defaultGridOptions } from './grid-options';

export type AgGridWrapperProps = {
	height?: number;
	children: ReactElement;
	rightBar?: ReactNode;
	title?: string;
	error?: Error | null;
	loading?: boolean;
	className?: string;
	gridApi?: GridApi;
	quickFilterEnabled?: boolean;
};

/**
 * This component is a wrapper for the AgGridReact component.
 * It provides a few extra features like a quick filter and a right bar.
 * It must always be imported using dynamic import.
 */
export default function AgGridWrapper({
	children,
	height,
	title,
	error,
	rightBar,
	loading,
	className,
	quickFilterEnabled = true,
}: Readonly<AgGridWrapperProps>) {
	const [filterText, setFilterText] = useState('');
	const gridRef = useRef<AgGridReact>(null);
	const theme = useTheme();

	const childProps = (children as ReactElement<any>).props;

	// Determine if we need to add the cursor-pointer class
	const hasOnRowClicked = !!childProps.onRowClicked;
	const existingRowClass = childProps.rowClass || '';
	const rowClass = hasOnRowClicked
		? existingRowClass
			? `${existingRowClass} cursor-pointer`
			: 'cursor-pointer'
		: existingRowClass;

	const childWithRef = cloneElement(children as ReactElement<any>, {
		ref: gridRef,
		...defaultGridOptions,
		...childProps,
		// Apply the determined rowClass if needed
		...(hasOnRowClicked ? { rowClass } : {}),
	});

	const onFilterTextChanged = useCallback((value: string) => {
		setFilterText(value);
		// Apply filter to grid
		if (gridRef.current?.api) {
			gridRef.current.api.setGridOption('quickFilterText', value);
		}
	}, []);

	if (error) {
		console.error({ error });
		return (
			<Alert variant="destructive">
				There was an error loading your data. If this issue persists please
				contact our support.
			</Alert>
		);
	}

	return (
		<div
			className={clsx({
				'flex grow flex-col': !height,
				className,
			})}
			data-ag-theme-mode={theme.theme}
		>
			<div
				className={cn('flex items-center justify-between', {
					'py-2': !!rightBar,
				})}
			>
				<div className="flex items-center space-x-2">
					{title ? (
						<div className="text-foreground flex items-center space-y-4 py-2">
							{title}
							{loading ? <LoadingIcon /> : null}
						</div>
					) : null}
					{quickFilterEnabled && (
						<>
							<Input
								className="my-1 h-8 w-72 rounded-lg"
								value={filterText}
								placeholder="Search..."
								onChange={(e) => onFilterTextChanged(e.target.value)}
							/>
							{filterText && (
								<Button
									onClick={() => onFilterTextChanged('')}
									variant="link"
									className="h-8"
								>
									Clear
								</Button>
							)}
						</>
					)}
				</div>
				{rightBar}
			</div>

			<div style={{ height: height ?? '100%' }}>{childWithRef}</div>
		</div>
	);
}
