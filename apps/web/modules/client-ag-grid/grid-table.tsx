'use client';

import type { AgGridReactProps } from 'ag-grid-react';
import type { ReactNode } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { cn } from '@repo/ui/utils';
import { AgGridReact } from 'ag-grid-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useCallback, useRef, useState } from 'react';
import { defaultGridOptions } from './grid-options';

export interface GridTableProps<TData> extends AgGridReactProps<TData> {
  className?: string;
  quickFilterEnabled?: boolean;
  rightBar?: ReactNode;
}

export default function GridTable<TData>({
  className,
  quickFilterEnabled = true,
  rightBar,
  gridOptions,
  ...props
}: Readonly<GridTableProps<TData>>) {
  const [filterText, setFilterText] = useState('');
  const gridRef = useRef<AgGridReact>(null);
  const { theme } = useTheme();
  const onFilterTextChanged = useCallback((value: string) => {
    setFilterText(value);
    // Apply filter to grid
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('quickFilterText', value);
    }
  }, []);

  return (
    <div
      className={clsx('flex h-full grow flex-col', className)}
      data-ag-theme-mode={theme}
    >
      <div
        className={cn('flex items-center justify-between', {
          'py-2': !!rightBar,
        })}
      >
        <div className="flex items-center space-x-2">
          {quickFilterEnabled && (
            <>
              <Input
                className="my-1 h-8 w-72 rounded-lg"
                value={filterText}
                placeholder="Search..."
                onChange={e => onFilterTextChanged(e.target.value)}
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

      <div className="flex-1 grow">
        <AgGridReact<TData>
          ref={gridRef}
          {...props}
          gridOptions={{
            ...defaultGridOptions,
            ...gridOptions,
            rowClass: props.onRowClicked
              ? 'cursor-pointer hover:!bg-muted/50'
              : undefined,
          }}
          // onFilterChanged={() => {
          //   console.log(gridRef.current?.api?.getFilterModel());
          // }}
        />
      </div>
    </div>
  );
}
