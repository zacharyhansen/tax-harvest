import type { BaseFieldProps } from '../form-builder.types';

import {
  TiptapBase,
  type TiptapBaseProps,
} from '@repo/ui/tiptap/molecules/tiptap-base';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';

export default function TiptapBasicField({
  name,
  label,
  description,
  ...props
}: Readonly<BaseFieldProps & TiptapBaseProps>) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <TiptapBase {...props} {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
