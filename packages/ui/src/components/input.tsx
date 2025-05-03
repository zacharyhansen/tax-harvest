import type { LucideIcon } from 'lucide-react';
import type { BaseInputProps } from './input.types';

import { cn } from '@repo/ui/utils';
import * as React from 'react';
import { inputVariants } from './input.variants';

import { Label } from './label';

export type InputProps = {
  label?: React.ReactNode;
  actionElement?: React.ReactNode;
  variant?: 'default' | 'ghost';
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
} & BaseInputProps & React.InputHTMLAttributes<HTMLInputElement>;

const Input = (
  { ref, className, type, label, actionElement, startIcon, variant = 'default', ...props }: InputProps & { ref?: React.RefObject<HTMLInputElement | null> },
) => {
  useDisableNumberInputScroll();
  const StartIcon = startIcon;
  // const EndIcon = endIcon;
  return (
    <div className="items-center gap-1.5">
      {label ? <Label htmlFor={props.id}>{label}</Label> : null}
      <div className="flex items-center space-x-2">
        {StartIcon && (
          <div className="left-1">
            <StartIcon size={18} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(inputVariants({ variant }), className)}
          autoComplete="off"
          ref={ref}
          {...props}
        />
        {actionElement ?? null}
      </div>
    </div>
  );
};
Input.displayName = 'Input';

export { Input };

function useDisableNumberInputScroll() {
  // Use the useEffect hook to manage side effects
  React.useEffect(() => {
    // Define a function to prevent the default scroll behavior
    const handleWheel = (event: { preventDefault: () => void }) => {
      event.preventDefault();
    };

    // Find all number input elements in the document
    const numberInputs = document.querySelectorAll('input[type="number"]');

    // Attach the handleWheel function as an event listener to each number input
    for (const input of numberInputs) {
      input.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Clean up by removing the event listeners when the component unmounts
    return () => {
      for (const input of numberInputs) {
        input.removeEventListener('wheel', handleWheel);
      }
    };
  }, []); // The empty dependency array ensures that this effect runs once, like componentDidMount
}
