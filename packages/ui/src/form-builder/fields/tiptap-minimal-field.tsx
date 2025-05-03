import type { TiptapBaseProps } from '@repo/ui/tiptap/molecules/tiptap-base';

import type { BaseFieldProps } from '../form-builder.types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import {
  TiptapBase,

} from '@repo/ui/tiptap/molecules/tiptap-base';

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
