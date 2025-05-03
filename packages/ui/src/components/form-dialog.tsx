'use client';

import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';

import { Alert } from './alert';
import { Button } from './button';
import { Form } from './form';
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from './reponsive-dialog';

type FormDialogProps = {
  children: ReactNode;
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;

  // eslint-disable-next-line ts/no-explicit-any
  form: UseFormReturn<any>;
  defaultOpen?: boolean;
};

export default function FormDialog({
  children,
  title,
  handleSubmit,
  form,
  description,
  trigger,
  defaultOpen = false,
}: FormDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [error, setError] = useState<boolean>(false);

  const disabled
    = form.formState.isSubmitting
      || form.formState.isLoading
      || form.formState.isValidating;

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          {title
            ? (
                <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
              )
            : null}
          {description
            ? (
                <ResponsiveDialogDescription>
                  {description}
                </ResponsiveDialogDescription>
              )
            : null}
        </ResponsiveDialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={disabled}>
              <ResponsiveDialogBody className="group-disabled:opacity-50">
                {children}
              </ResponsiveDialogBody>
            </fieldset>
          </form>
        </Form>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="secondary" disabled={disabled}>
              Close
            </Button>
          </ResponsiveDialogClose>
          <Button
            disabled={disabled}
            loading={form.formState.isSubmitting}
            onClick={() => {
              void form
                .trigger()
                .then((passed) => {
                  if (passed) {
                    return handleSubmit().then(() => {
                      setError(false);
                      setIsOpen(false);
                    });
                  }
                })
                .catch(() => {
                  setError(true);
                });
            }}
            type="button"
          >
            Submit
          </Button>
        </ResponsiveDialogFooter>
        {error
          ? (
              <Alert variant="destructive">
                There was an error with the submission
              </Alert>
            )
          : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
