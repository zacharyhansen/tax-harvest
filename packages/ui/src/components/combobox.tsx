'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { z } from 'zod';

import { cn } from '../utils';

import type { BaseInputProps } from './input.types';
import { Label } from './label';

import { Button } from '@repo/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover';

export const ComboboxOptionSchema = z.object({
  label: z.any(), // React.ReactNode (can be anything, e.g., string, number, JSX)
  value: z.string(),
  keywords: z.array(z.string()).optional(),
});

export interface ComboboxOption {
  /** The text to display for the option. */
  label: React.ReactNode;
  /** The react node dispalyed in the combobox option list. */
  richLabel?: React.ReactNode;
  /** The unique value associated with the option. */
  value: string;
  /** Optional keywords to search by. */
  keywords?: string[];
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ComboboxProps extends BaseInputProps {
  options: ComboboxOption[];
  value?: string;
  description?: React.ReactNode;
  label?: React.ReactNode;
  onChange: (value?: string) => void;
  className?: string;
  filter?: (value: string, search: string, keywords?: string[]) => number;
}

const Combobox = React.forwardRef<HTMLButtonElement, Readonly<ComboboxProps>>(
  (
    {
      options,
      placeholder,
      disabled,
      value,
      onChange,
      className,
      description,
      label,
      filter,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger disabled={disabled} className="w-full">
            <div className="flex flex-col items-start gap-1">
              {label ? <Label>{label}</Label> : null}
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                type="button"
                className={cn(
                  'w-full min-w-[200px] max-w-full items-center justify-between',
                  disabled && 'cursor-not-allowed opacity-50',
                  className
                )}
                ref={ref}
                disabled={disabled}
              >
                {value ? (
                  options.find(option => option.value === value)?.label
                ) : (
                  <div className="text-muted-foreground">
                    {placeholder ?? 'Select...'}
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="z-[60] p-0"
            style={{
              maxHeight: 'calc(var(--radix-popper-available-height) - 10px)',
            }}
          >
            <Command
              className="max-h-[var(--radix-popper-available-height)]"
              filter={filter}
            >
              <CommandInput placeholder={placeholder ?? 'Search...'} />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup>
                  {options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={
                        option.keywords ??
                        (typeof option.label === 'string'
                          ? [option.label]
                          : [option.value])
                      }
                      onSelect={currentValue => {
                        onChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.richLabel ?? option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="text-muted-foreground pt-1 text-xs">
          {description ? description : null}
        </div>
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export { Combobox };
