'use client';

import type { BaseInputPropsType } from './input.types';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import * as React from 'react';

import { cn } from '../utils';

const Checkbox = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  BaseInputPropsType & { ref?: React.RefObject<React.ElementRef<typeof CheckboxPrimitive.Root> | null> }) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-lg border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckIcon className="size-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export type CheckboxFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const CheckboxField = ({ ref, label, description, ...props }: CheckboxFieldProps & { ref?: React.RefObject<React.ElementRef<typeof CheckboxPrimitive.Root> | null> }) => (
  <div>
    <div className={cn('flex items-center space-x-2')}>
      <Checkbox {...props} ref={ref} disabled={props.disabled} />
      {label
        ? (
            <label
              htmlFor={props.id}
              className=" cursor-pointer items-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )
        : null}
    </div>
    {description
      ? (
          <p className="pl-6 text-sm text-muted-foreground">{description}</p>
        )
      : null}
  </div>
);

CheckboxField.displayName = 'CheckboxField';

export { Checkbox, CheckboxField };
