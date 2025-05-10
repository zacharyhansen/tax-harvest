import type { Header } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
  MixIcon,
} from "@radix-ui/react-icons";
import { cn } from "@repo/ui/utils/cn";

import { flexRender } from "@tanstack/react-table";
import { Button } from "../../button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../dropdown-menu";

type DataTableColumnHeaderProps<TData, TValue> = {
  header: Header<TData, TValue>;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * @deprecated
 */
export default function DefaultHeader<TData, TValue>({
  className,
  header,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { column, getContext } = header;
  if (!column.getCanSort()) {
    return (
      <div className={cn(className)}>
        {flexRender(column.columnDef.header, getContext())}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            {header.column.getIsGrouped() ? (
              <MixIcon className="mr-2 size-4 font-semibold" />
            ) : null}
            <span>{flexRender(column.columnDef.header, getContext())}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 size-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
