import { zodResolver } from '@hookform/resolvers/zod';
import type { NodeViewProps } from '@tiptap/core';
import { snakeCase } from 'change-case';
import { useEffect } from 'react';
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import type { z, ZodType } from 'zod';

export const useFormLabel = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FormSchema extends ZodType<any, any, any>,
  TFieldValues extends FieldValues & {
    name: string;
    label: string;
  },
>({
  schema,
  editor,
  getPos,
  node,
  updateAttributes,
  setOpen,
  defaultValues,
}: {
  schema: FormSchema;
  setOpen: (open: boolean) => void;
  defaultValues:
    | DefaultValues<TFieldValues>
    | ((payload?: unknown) => Promise<TFieldValues>);
} & NodeViewProps) => {
  const nodeEndPos = getPos() + node.nodeSize;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      editor
        .chain()
        .focus(nodeEndPos)
        .insertContent([
          {
            type: 'paragraph',
          },
        ])
        .run();
    }
  };

  const form = useForm<z.infer<FormSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { watch, setValue } = form;

  const handleSubmit = (values: z.infer<FormSchema>) => {
    try {
      updateAttributes(values);
      setOpen(false);
      toast.success('Saved');
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to save. Please try again.');
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // eslint-disable-next-line sonarjs/different-types-comparison
      if (name === 'label' && !value.nameLocked && value.label) {
        // @ts-expect-error cant get the types to always include name and label
        setValue('name', snakeCase(value.label));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setValue]);

  const handleOpen = (open: boolean) => {
    // Whenever we open the form we need to reset to the current nodes values
    if (open) {
      form.reset(defaultValues);
    }
    setOpen(open);
  };

  return { handleKeyDown, handleSubmit, form, handleOpen };
};
