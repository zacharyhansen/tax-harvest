"use client";

import type { Table } from "@tanstack/react-table";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixIcon } from "@radix-ui/react-icons";

import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../dropdown-menu";

type DataTableGroupOptionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableGroupOptions<TData>({
  table,
}: DataTableGroupOptionsProps<TData>) {
  const groupableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanGroup(),
    );

  if (!groupableColumns.length) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixIcon className="mr-2 size-4" />
          Group
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Group rows</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {groupableColumns.map((column) => {
          const handler = column.getToggleGroupingHandler();
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsGrouped()}
              onCheckedChange={() => handler()}
            >
              {typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
