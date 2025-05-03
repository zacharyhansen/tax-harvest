import type { InputProps } from '@repo/ui/components/input';
import { Button } from '@repo/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { Input } from '@repo/ui/components/input';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover';

import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { cn } from '../utils';
import { ScrollArea } from './scroll-area';

export type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
  onChange?: (value: RPNInput.Value) => void;
};

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps>
  = ({ ref, className, onChange, defaultCountry = 'US', ...props }: PhoneInputProps & { ref?: React.RefObject<React.ElementRef<typeof RPNInput.default> | null> }) => {
    return (
      <RPNInput.default
        ref={ref}
        className={cn('flex', className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        defaultCountry={defaultCountry}
        smartCaret={false}
        /**
         * Handles the onChange event.
         *
         * react-phone-number-input might trigger the onChange event as undefined
         * when a valid phone number is not entered. To prevent this,
         * the value is coerced to an empty string.
         *
         * @param {E164Number | undefined} value - The entered value
         */
        onChange={(value) => {
          if (value) {
            onChange?.(value);
          }
        }}
        {...props}
      />
    );
  };
PhoneInput.displayName = 'PhoneInput';

const InputComponent = ({ ref, className, ...props }: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => (
  <Input
    className={cn('rounded-e-lg rounded-s-none', className)}
    {...props}
    ref={ref}
  />
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = {
  label: string;
  value: RPNInput.Country;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              '-mr-2 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => (
                  <CommandItem
                    className="gap-2"
                    key={option.value + index}
                    onSelect={() => {
                      handleSelect(option.value);
                    }}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                      key={option.value}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                    {option.value && (
                      <span className="text-sm text-foreground/50">
                        {`+${RPNInput.getCountryCallingCode(option.value)}`}
                      </span>
                    )}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        option.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };
