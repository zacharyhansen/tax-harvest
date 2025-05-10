"use client";

import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";

import { Label } from "@repo/ui/components/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "../hooks/use-debounce";

export type ComboboxAsyncOption = {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
};

export type AsyncSelectProps<T> = {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Async function to fetch inital options to load the combobox with - if not provided the fetcher is fired with the value as query */
  initalFetcher?: (query?: string) => Promise<T[]>;
  /** Preload all data ahead of time */
  preload?: boolean;
  /** Function to filter options */
  filterFn?: (option: T, query: string) => boolean;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  width?: string | number;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
};

export function ComboboxAsync<T>({
  fetcher,
  initalFetcher,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  width = "200px",
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
}: AsyncSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 400);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setSelectedValue(value);
  }, [value]);

  // Initialize selectedOption when options are loaded and value exists
  useEffect(() => {
    if (value && options.length > 0) {
      const option = options.find((opt) => getOptionValue(opt) === value);
      if (option) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setSelectedOption(option);
      }
    }
  }, [value, options, getOptionValue]);

  // Effect for initial fetch
  useEffect(() => {
    const initializeOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        // If we have a value, use it for the initial search
        const data = initalFetcher
          ? await initalFetcher(value)
          : await fetcher(value);
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch options",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!mounted) {
      void initializeOptions();
    }
  }, [mounted, initalFetcher, fetcher, value]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(debouncedSearchTerm);
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch options",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!preload && mounted) {
      void fetchOptions();
    } else if (preload) {
      if (debouncedSearchTerm) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setOptions(
          originalOptions.filter((option) =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true,
          ),
        );
      } else {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setOptions(originalOptions);
      }
    }
    // dont include most inital props - pulled this component from another project and seemed super request noisy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, mounted]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const newValue =
        clearable && currentValue === selectedValue ? "" : currentValue;
      setSelectedOption(
        options.find((option) => getOptionValue(option) === newValue) || null,
      );
      setSelectedValue(newValue);
      onChange(newValue);
      setOpen(false);
    },
    [selectedValue, onChange, clearable, options, getOptionValue],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex max-w-full flex-col items-start gap-2">
          {label && <Label>{label}</Label>}
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              disabled && "cursor-not-allowed opacity-50",
              triggerClassName,
            )}
            disabled={disabled}
          >
            <div className="overflow-hidden text-ellipsis">
              {selectedOption ? getDisplayValue(selectedOption) : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent style={{ width }} className={cn("p-0", className)}>
        <Command shouldFilter={false}>
          <div className="relative w-full border-b">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
              }}
            />
            {loading && options.length > 0 && (
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
                <Loader2 className="size-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-center text-destructive">{error}</div>
            )}
            {loading &&
              options.length === 0 &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading &&
              !error &&
              options.length === 0 &&
              (notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={handleSelect}
                >
                  {renderOption(option)}
                  <Check
                    className={cn(
                      "ml-auto h-3 w-3",
                      selectedValue === getOptionValue(option)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex w-full items-center gap-2">
            <div className="size-6 animate-pulse rounded-full bg-muted" />
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
