'use client';
import * as React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import type { LucideIcon } from 'lucide-react';

import { useHotkeys } from '../hooks/use-hot-keys';
import { cn } from '../utils';

import { Label } from './label';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { Button } from '@repo/ui/components/button';

interface CommandOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface CommandBoxProps {
  defaultValue?: string;
  commandOptions: CommandOption[];
  commandKey?: string;
  label?: string;
  placeholder?: React.ReactNode;
  onChange?: (value: string | null) => void;
  filter?: (value: string, search: string, keywords?: string[]) => number;
}

export const CommandBox = ({
  commandOptions,
  commandKey = 'P',
  label,
  placeholder = 'Select...',
  filter,
  defaultValue,
  onChange,
}: CommandBoxProps) => {
  const [openPopover, setOpenPopover] = React.useState(false);

  const [selectedCommand, setSelectedCommand] =
    React.useState<CommandOption | null>(
      defaultValue
        ? (commandOptions.find(option => option.value === defaultValue) ?? null)
        : null
    );

  const [searchValue, setSearchValue] = React.useState('');

  const isSearching = searchValue.length > 0;

  useHotkeys([
    [
      commandKey,
      () => {
        setOpenPopover(true);
      },
    ],
  ]);

  const handleSelectedCommand = (command: CommandOption | null) => {
    setSelectedCommand(command);
    onChange?.(command?.value ?? null);
    setOpenPopover(false);
    setSearchValue('');
  };

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <div>
          {label && <Label className="items-start">{label}</Label>}
          <Button
            aria-label="Select"
            variant="outline"
            size="sm"
            className="flex w-full justify-between text-[0.8125rem]"
          >
            {selectedCommand ? (
              <div className="flex items-center space-x-2 text-current">
                <selectedCommand.icon
                  className={cn('mr-2 size-4')}
                  aria-hidden="true"
                />
                {selectedCommand.label}
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
            <Kbd commandKey={commandKey} />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[206px] rounded-lg p-0"
        align="start"
        onCloseAutoFocus={event => {
          event.preventDefault();
        }}
        sideOffset={6}
      >
        <Command className="rounded-lg" filter={filter}>
          <CommandInput
            value={searchValue}
            onValueChange={searchValue => {
              const key = Number.parseInt(searchValue);
              // If the user types a number, select the command like useHotkeys
              if (key >= 0 && key < commandOptions.length) {
                handleSelectedCommand(commandOptions[key] ?? null);
                return;
              }
              setSearchValue(searchValue);
            }}
            className="text-[0.8125rem] leading-normal"
            placeholder="Search..."
          />
          <CommandList>
            <CommandGroup>
              {commandOptions.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={value => {
                    handleSelectedCommand(
                      commandOptions.find(p => p.value === value) ?? null
                    );
                  }}
                  className="group flex w-full items-center justify-between rounded-lg text-[0.8125rem] leading-normal"
                >
                  <div className="flex items-center">
                    <option.icon className="mr-2 size-4" />
                    <span>{option.label}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedCommand?.value === option.value && (
                      <CheckIcon
                        id="Check"
                        className="fill-muted-foreground group-hover:fill-primary mr-3 size-4"
                      />
                    )}
                    {!isSearching && <span className="text-xs">{index}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Kbd = ({ commandKey }: { commandKey: string }) => {
  return (
    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
      {commandKey}
    </kbd>
  );
};
