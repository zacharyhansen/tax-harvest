'use client';

import type {
  AggregationFn,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  GroupingState,
  InitialTableState,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cn } from '@repo/ui/utils';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';

import React, { useCallback, useMemo } from 'react';
import { Alert } from '../alert';
import { Skeleton } from '../skeleton';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import AvatarGroupCell from './cells/avatarGroupCell';
import BadgeCell from './cells/badgeCell';
import DateCell from './cells/dateCell';
import DateTimeCell from './cells/dateTimeCell';
import FooterCell from './cells/footerCell';
import ListCell from './cells/listCell';
import MoneyCell from './cells/moneyCell';
import PercentCell from './cells/percentCell';
import UserCell from './cells/userCell';
import { DataTableToolbar } from './dataTableToolbar';
import { BasicHeader } from './headers/basicHeader';
import DefaultHeader from './headers/defaultHeader';

import { IndeterminateCheckbox } from './indeterminateCheckbox';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface AggregationFns {
    // eslint-disable-next-line ts/no-explicit-any
    sumDecimal: AggregationFn<any>;
    // eslint-disable-next-line ts/no-explicit-any
    avgDecimal: AggregationFn<any>;

    // eslint-disable-next-line ts/no-explicit-any
    sumMoney: AggregationFn<any>;

    // eslint-disable-next-line ts/no-explicit-any
    [key: string]: AggregationFn<any>;
  }
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line ts/consistent-type-definitions, unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateCell: (rowIndex: number, columnId: string, value: unknown) => void;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars, ts/consistent-type-definitions
  interface ColumnMeta<TData extends RowData, TValue> {
    // TODO: This is super bare bones for now - create true filter interface for different types (date, string, etc.)
    filterDef?: {
      label: string;
      options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
      }[];
    };
    searchable?: boolean;
    groupable?: boolean;
    preventRowClick?: boolean;
    aggregationFn?: AggregationFn<TData> | 'sumDecimal' | 'sumMoney';
  }
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  noResultsAlert: ReactNode;
  loading?: boolean;
  error?: boolean;
  onRowClick?: (data?: Row<TData>) => void;
  initialState?: InitialTableState;
  customAggregationFns?: Record<string, AggregationFn<TData>>;
  enableRowSelection?: boolean;
  /**
   *
   * @returns optional modified row state
   */
  onRowSelectionChange?: (params: {
    selectedRows: TData[];
    updatedRowSelection: RowSelectionState;
  }) => void;
  rowSelectionState?: RowSelectionState;
  header?: ReactNode;
  onUpdateCell?: (rowIndex: number, columnId: string, value: unknown) => void;
  className?: string;
};

function DataTable<TData, TValue>({
  columns,
  customAggregationFns,
  data = [],
  enableRowSelection,
  error,
  header,
  initialState,
  loading,
  noResultsAlert,
  onRowClick,
  onRowSelectionChange,
  onUpdateCell,
  rowSelectionState,
  className,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility]
    = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? [],
  );
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [grouping, setGrouping] = React.useState<GroupingState>(
    initialState?.grouping ?? [],
  );

  const searchableColumns = useMemo(
    () =>
      new Set(
        columns
          .filter(c => c.meta?.searchable)
          // @ts-expect-error this exists but not sure why
          .map(c => (c.accessorKey as string).replaceAll('.', '_')),
      ),
    [columns],
  );

  const fuzzyFilter: FilterFn<TData> = (row, columnId, value, addMeta) => {
    if (!searchableColumns.has(columnId)) {
      return false;
    }
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value ?? '');

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const handleOnRowSelectionChange = useCallback(
    (valueFn: Updater<RowSelectionState>) => {
      if (typeof valueFn === 'function') {
        const state = rowSelectionState ?? rowSelection;
        const updatedRowSelection = valueFn(state);

        // Get current tables selected rows
        const selectedRows = Object.keys(updatedRowSelection).reduce<TData[]>(
          (acc, key) => {
            if (updatedRowSelection[key]) {
              const index = Number.parseInt(key, 10);
              const row = data[index];
              if (row) {
                acc.push(row);
              }
            }
            return acc;
          },
          [],
        );

        // Invoke parent row selection if it exists - parent can modify if needed
        onRowSelectionChange?.({
          selectedRows,
          updatedRowSelection,
        });

        // Set table state
        setRowSelection(updatedRowSelection);
      }
    },
    [data, onRowSelectionChange, rowSelection, rowSelectionState],
  );

  const table = useReactTable({
    aggregationFns: {
      // generic functions
      avgDecimal: (columnId, leafRows) => {
        const total = leafRows.reduce(
          (sum, row) => sum + Number(row.getValue(columnId) || 0),
          0,
        );
        return (total / leafRows.length).toFixed(2);
      },
      sumDecimal: (columnId, leafRows) =>
        leafRows
          .reduce((sum, row) => sum + Number(row.getValue(columnId) || 0), 0)
          .toFixed(2),
      sumMoney: (columnId, leafRows) =>
        `$${leafRows
          .reduce((sum, row) => sum + Number(row.getValue(columnId) || 0), 0)
          .toFixed(2)}`,

      ...customAggregationFns,
    },
    autoResetExpanded: false,
    columns,
    data,
    defaultColumn: {
      enableGrouping: false,
      maxSize: Number.MAX_SAFE_INTEGER,
      // minSize: 20,
      // size: 150,
    },
    enableRowSelection,
    filterFns: {
      fuzzy: fuzzyFilter, // define as a filter function that can be used in column definitions
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // @ts-expect-error Above fuzzy is provided TODO figure out why ts errors
    globalFilterFn: 'fuzzy',
    initialState,
    meta: {
      updateCell: (...params) => {
        onUpdateCell?.(...params);
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onRowSelectionChange: handleOnRowSelectionChange,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      grouping,
      rowSelection: rowSelectionState ?? rowSelection,
      sorting,
    },
  });

  if (error) {
    return <Alert>There was an error displaying your table.</Alert>;
  }

  const hasFooter = table
    .getFooterGroups()
    .some(group => group.headers.some(h => h.column.columnDef.footer));

  return (
    <div
      className={cn(
        'mx-auto flex min-h-96 w-fit max-w-full flex-grow flex-col space-y-2',
        className,
      )}
    >
      {header || null}
      <DataTableToolbar table={table} setGlobalFilter={setGlobalFilter} />
      <Table className="block min-w-full">
        <TableHeader className="sticky top-0 bg-secondary">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      maxWidth: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      position: 'sticky',
                      width: header.column.getSize(),
                      cursor: header.column.getCanSort()
                        ? 'pointer'
                        : 'default',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === 'asc'
                          ? 'Sort ascending'
                          : header.column.getNextSortingOrder() === 'desc'
                            ? 'Sort descending'
                            : 'Clear sort'
                        : undefined
                    }
                  >
                    <span>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </span>
                    {{
                      asc: (
                        <CircleArrowUp className="ml-2 inline size-4 text-primary" />
                      ),
                      desc: (
                        <CircleArrowDown className="ml-2 inline size-4 text-primary" />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <div className="w-full">
          <TableBody className="block w-fit overflow-y-auto">
            {table.getRowModel().rows.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map(cell =>
                        !data.length && loading
                          ? (
                              <TableCell
                                key={cell.id}
                                className="bg-cyan-300"
                                style={{
                                  maxWidth: cell.column.getSize(),
                                  minWidth: cell.column.getSize(),
                                  width: cell.column.getSize(),
                                }}
                              >
                                <Skeleton className="h-8 w-full" />
                              </TableCell>
                            )
                          : (
                              <TableCell
                                key={cell.id}
                                className={clsx({
                                  'bg-secondary': row.getIsGrouped(),
                                  'font-bold': cell.getIsAggregated(),
                                })}
                                style={{
                                  maxWidth: cell.column.getSize(),
                                  minWidth: cell.column.getSize(),
                                  width: cell.column.getSize(),
                                }}
                                onClick={
                                  onRowClick
                                  && !cell.column.columnDef.meta?.preventRowClick
                                    ? () => onRowClick(row)
                                    : undefined
                                }
                              >
                                {cell.getIsGrouped()
                                  ? (
                                      <button
                                        className="flex items-center space-x-2"
                                        onClick={row.getToggleExpandedHandler()}
                                        type="button"
                                      >
                                        {row.getIsExpanded()
                                          ? (
                                              <ChevronDownIcon className="size-4" />
                                            )
                                          : (
                                              <ChevronRightIcon className="size-4" />
                                            )}
                                        <div className="flex flex-col items-start text-xs">
                                          <div className="font-bold">
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext(),
                                            )}
                                          </div>
                                          <div className="text-xs font-light text-secondary-foreground">
                                            {row.subRows.length}
                                            {' '}
                                            {row.subRows.length === 1 ? 'row' : 'rows'}
                                          </div>
                                        </div>
                                      </button>
                                    )
                                  : cell.getIsAggregated()
                                    ? (
                                        flexRender(
                                          cell.column.columnDef.aggregatedCell
                                          ?? cell.column.columnDef.cell,
                                          cell.getContext(),
                                        )
                                      )
                                    : cell.getIsPlaceholder()
                                      ? null
                                      : (
                                          flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                          )
                                        )}
                              </TableCell>
                            ),
                      )}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {noResultsAlert}
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </div>
        {hasFooter
          ? (
              <TableFooter className="sticky bottom-0 bg-secondary">
                {table.getFooterGroups().map(footerGroup => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map((column) => {
                      return (
                        <TableCell
                          key={column.id}
                          colSpan={column.colSpan}
                          style={{
                            maxWidth: column.getSize(),
                            minWidth: column.getSize(),
                            position: 'sticky',
                            width: column.getSize(),
                          }}
                        >
                          {column.isPlaceholder
                            ? null
                            : flexRender(
                                column.column.columnDef.footer,
                                column.getContext(),
                              )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableFooter>
            )
          : null}
      </Table>
      {/* <DataTablePagination table={table} /> */}
    </div>
  );
}

// Headers
DataTable.Header = DefaultHeader;
DataTable.BasicHeader = BasicHeader;

// Cells
DataTable.MoneyCell = MoneyCell;
DataTable.FooterCell = FooterCell;
DataTable.PercentCell = PercentCell;
DataTable.BadgeCell = BadgeCell;
DataTable.DateCell = DateCell;
DataTable.DateTimeCell = DateTimeCell;
DataTable.UserCell = UserCell;
DataTable.AvatarGroupCell = AvatarGroupCell;
DataTable.ListCell = ListCell;
DataTable.RowSelectCheckBox = IndeterminateCheckbox;

export * from './utils';

export default DataTable;
