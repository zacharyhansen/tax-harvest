'use client';

import type * as LabelPrimitive from '@radix-ui/react-label';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';
import { Label } from '@repo/ui/components/label';
import { cn } from '@repo/ui/utils';

import * as React from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.use(FormFieldContext);
  // eslint-disable-next-line ts/no-use-before-define
  const itemContext = React.use(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-1', className)} {...props} />
    </FormItemContext.Provider>
  );
};
FormItem.displayName = 'FormItem';

const FormLabel = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { ref?: React.RefObject<React.ElementRef<typeof LabelPrimitive.Root> | null> }) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};
FormLabel.displayName = 'FormLabel';

const FormControl = ({ ref, ...props }: React.ComponentPropsWithoutRef<typeof Slot> & { ref?: React.RefObject<React.ElementRef<typeof Slot> | null> }) => {
  const { error, formItemId, formDescriptionId, formMessageId }
    = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};
FormControl.displayName = 'FormControl';

const FormDescription = ({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-muted-foreground text-xs', className)}
      {...props}
    />
  );
};
FormDescription.displayName = 'FormDescription';

const FormMessage = ({ ref, className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => {
  const { error, formMessageId } = useFormField();

  const errorObject = isDatePickerError(error)
    ? (error.to ?? error.from)
    : error;

  const body = errorObject ? String(errorObject.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-destructive text-sm font-medium', className)}
      {...props}
    >
      {body}
    </p>
  );
};
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};

type DatePickerError = {
  to?: {
    message: string;
    type: string;
  };
  from?: {
    message: string;
    type: string;
  };
};

// eslint-disable-next-line ts/no-explicit-any
function isDatePickerError(error: any): error is DatePickerError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  return !!error.to;
}
