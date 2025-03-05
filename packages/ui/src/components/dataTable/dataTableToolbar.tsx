'use client';

import type { ColumnDef, Table } from '@tanstack/react-table';
import React from 'react';

import { Button } from '../button';
import { Input } from '../input';

import { DataTableFacetedFilter } from './dataTableFacetedFilter';
import { DataTableGroupOptions } from './dataTableGroupOptions';
import { DataTableViewOptions } from './dataTableViewOptions';

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  setGlobalFilter: (value: string) => void;
  filterColumns?: ColumnDef<TData, TValue>[];
}

export function DataTableToolbar<TData, TValue>({
  setGlobalFilter,
  table,
}: DataTableToolbarProps<TData, TValue>) {
  const { columnFilters, columnVisibility, globalFilter, grouping } =
    table.getState();

  const isModified =
    globalFilter ||
    grouping.length ||
    columnFilters.length ||
    Object.keys(columnVisibility).length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DebouncedInput
          value={globalFilter}
          onChange={value => setGlobalFilter(String(value))}
          className="font-lg border-block w-52 border p-2 shadow"
          placeholder="Search"
        />
        {table
          .getAllColumns()
          .filter(c => c.columnDef.meta?.filterDef)
          .map(c => (
            <DataTableFacetedFilter
              key={c.id}
              column={c}
              title={c.columnDef.meta?.filterDef?.label}
              options={c.columnDef.meta?.filterDef?.options || []}
            />
          ))}

        {isModified ? (
          <Button
            variant="link"
            onClick={() => {
              table.resetColumnFilters(true);
              setGlobalFilter('');
              table.resetGrouping(true);
              table.resetColumnVisibility(true);
            }}
            className="text-primary"
          >
            Reset
          </Button>
        ) : null}
      </div>
      <div className="flex space-x-2">
        <DataTableGroupOptions table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

function DebouncedInput({
  debounce = 500,
  onChange,
  value: initialValue,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, value, onChange]);

  return (
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  );
}
