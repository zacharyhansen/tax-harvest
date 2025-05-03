import type { NodeViewProps } from '@tiptap/core';
import type { ComboboxNodeAttributes } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { ComboboxOptionSchema } from '@repo/ui/components/combobox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';

import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@repo/ui/components/reponsive-dialog';

import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@repo/ui/components/sortable';
import { Switch } from '@repo/ui/components/switch';

import ComboboxField from '@repo/ui/form-builder/fields/combobox.field';
import InputField from '@repo/ui/form-builder/fields/input.field';
import SwitchField from '@repo/ui/form-builder/fields/switch.field';
import TextareaField from '@repo/ui/form-builder/fields/textarea.field';
import { NodeViewWrapper } from '@tiptap/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Footer,
  Header,
  InfoAndDeleteIcons,
  LabelInput,
  OptionsIcon,
  PencilIcon,
} from './common';
import { useFormLabel } from './use-form-label';

const formSchema = z.object({
  name: z.string().min(5),
  label: z.string().min(1),
  defaultValue: z.string().optional(),
  description: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  nameLocked: z.boolean(),
});

const OptionsFormSchema = z.object({
  options: z
    .array(ComboboxOptionSchema)
    .min(1, 'At least one option is required'),
});

export function FormComboboxLabel(props: NodeViewProps) {
  const { node, editor, updateAttributes } = props;

  const {
    label,
    required,
    name,
    defaultValue,
    description,
    placeholder,
    nameLocked,
    options,
  } = node.attrs as ComboboxNodeAttributes;

  const { isEditable } = editor;

  const [open, setOpen] = useState(false);

  const { form, handleSubmit, handleKeyDown, handleOpen } = useFormLabel({
    schema: formSchema,
    setOpen,
    defaultValues: {
      name,
      label,
      defaultValue,
      description,
      placeholder,
      required,
      nameLocked,
    },
    ...props,
  });
  const { formState } = form;

  // Options Stuff
  const [optionsOpen, setOptionsOpen] = useState(false);

  const optionsForm = useForm<z.infer<typeof OptionsFormSchema>>({
    resolver: zodResolver(OptionsFormSchema),
    defaultValues: {
      options,
    },
  });

  const { fields, append, move, remove } = useFieldArray({
    control: optionsForm.control,
    name: 'options',
  });

  const handleOptionsOpen = (open: boolean) => {
    if (open) {
      optionsForm.reset({ options });
    }
    setOptionsOpen(open);
  };

  const handleOptionsSubmit = (values: z.infer<typeof OptionsFormSchema>) => {
    try {
      updateAttributes(values);
      setOptionsOpen(false);
      toast.success('Saved');
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to save. Please try again.');
    }
  };

  return (
    <NodeViewWrapper className="relative flex min-h-[18.5px] items-center text-lg font-medium text-gray-900">
      <LabelInput {...props} onKeyDown={handleKeyDown} />
      <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100">
        {isEditable
          ? (
              <>
                <ResponsiveDialog open={open} onOpenChange={handleOpen}>
                  <PencilIcon />
                  <ResponsiveDialogContent>
                    <div>{JSON.stringify(form.formState.errors)}</div>
                    <FormProvider {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col space-y-4"
                      >
                        <Header />
                        <ResponsiveDialogBody className="flex flex-col space-y-2">
                          <SwitchField
                            name="required"
                            label="Required"
                            description="Is a value required for this field to submit?."
                          />
                          <InputField
                            name="label"
                            label="Label"
                            description="The label of the field."
                          />
                          <InputField
                            name="name"
                            label={(
                              <div className="flex items-center">
                                <Label htmlFor="name">Slug</Label>
                                <div className="ml-auto">
                                  <FormField
                                    name="nameLocked"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-center space-x-2">
                                        <FormLabel>Locked?</FormLabel>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            description="This is the slug/key the value will appear under in the submit payload of the form. It must follow the 'snake_case' convention. Lock the field if you want it to remain the same when changing the label."
                          />
                          <TextareaField
                            name="description"
                            label="Description"
                            description="The description of the field that describes its purppose/context."
                          />
                          <InputField
                            name="placeholder"
                            label="Placeholder"
                            description="The muted value that shows in the field when it is empty."
                          />
                          <ComboboxField
                            name="defaultValue"
                            label="Default Value"
                            description="A value to pre-populate the field with when the form is loaded."
                            options={options}
                          />
                        </ResponsiveDialogBody>
                        <Footer isDirty={formState.isDirty} setOpen={setOpen} />
                      </form>
                    </FormProvider>
                  </ResponsiveDialogContent>
                </ResponsiveDialog>
                <ResponsiveDialog
                  open={optionsOpen}
                  onOpenChange={handleOptionsOpen}
                >
                  <OptionsIcon />
                  <ResponsiveDialogContent>
                    <FormProvider {...form}>
                      <form
                        onSubmit={optionsForm.handleSubmit(handleOptionsSubmit)}
                        className="flex-flex-col space-y-4"
                      >
                        <ResponsiveDialogHeader>
                          <ResponsiveDialogTitle>
                            Manage Options
                          </ResponsiveDialogTitle>
                          <ResponsiveDialogDescription>
                            Create, modify, re-order, and delete options for your
                            field.
                          </ResponsiveDialogDescription>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              append({ label: '', value: '' });
                            }}
                          >
                            Add option
                          </Button>
                        </ResponsiveDialogHeader>
                        <ResponsiveDialogBody className="flex flex-col space-y-2">
                          <div className="flex w-full flex-col gap-2 py-1">
                            <div className="grid h-8 grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
                              <Label>Label</Label>
                              <Label>Value</Label>
                              {/* Empty spaces for alignment with the last two columns */}
                              <div className="size-8 shrink-0 opacity-0"></div>
                              <div className="size-8 shrink-0 opacity-0"></div>
                            </div>
                          </div>
                          {optionsOpen
                            ? (
                                <Sortable
                                  value={fields}
                                  onMove={({ activeIndex, overIndex }) => {
                                    move(activeIndex, overIndex);
                                  }}
                                  overlay={(
                                    <div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
                                      <div className="h-8 w-full rounded-sm bg-primary/10" />
                                      <div className="h-8 w-full rounded-sm bg-primary/10" />
                                      <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
                                      <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
                                    </div>
                                  )}
                                >
                                  <div className="flex w-full flex-col gap-2 py-1">
                                    {fields.map((option, index) => (
                                      <SortableItem
                                        key={option.id}
                                        value={option.id}
                                        asChild
                                      >
                                        <div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
                                          <FormField
                                            control={optionsForm.control}
                                            name={`options.${index}.label`}
                                            render={({ field }) => {
                                              return (
                                                <FormItem>
                                                  <FormControl>
                                                    {/* @ts-expect-error - TODO: fix this */}
                                                    <Input
                                                      className="h-8"
                                                      {...field}
                                                      onBlur={(event) => {
                                                        optionsForm.setValue(
                                                          `options.${index}.value`,
                                                          optionsForm.getValues(
                                                            `options.${index}.value`,
                                                          ) || event.currentTarget.value,
                                                        );
                                                      }}
                                                    />
                                                  </FormControl>
                                                </FormItem>
                                              );
                                            }}
                                          />
                                          <FormField
                                            control={optionsForm.control}
                                            name={`options.${index}.value`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormControl>
                                                  {/* @ts-expect-error - TODO: fix this */}
                                                  <Input className="h-8" {...field} />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                          <SortableDragHandle
                                            variant="outline"
                                            size="icon"
                                            className="size-8 shrink-0"
                                          >
                                            <DragHandleDots2Icon
                                              className="size-4"
                                              aria-hidden="true"
                                            />
                                          </SortableDragHandle>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="size-8 shrink-0"
                                            onClick={() => {
                                              remove(index);
                                            }}
                                          >
                                            <Trash2Icon
                                              className="size-4 text-destructive"
                                              aria-hidden="true"
                                            />
                                            <span className="sr-only">Remove</span>
                                          </Button>
                                        </div>
                                      </SortableItem>
                                    ))}
                                  </div>
                                </Sortable>
                              )
                            : null}
                        </ResponsiveDialogBody>
                        <Footer
                          isDirty={optionsForm.formState.isDirty}
                          setOpen={setOptionsOpen}
                        />
                      </form>
                    </FormProvider>
                  </ResponsiveDialogContent>
                </ResponsiveDialog>
              </>
            )
          : null}

        <InfoAndDeleteIcons
          name={name}
          defaultValue={defaultValue}
          {...props}
        />
      </div>
    </NodeViewWrapper>
  );
}
