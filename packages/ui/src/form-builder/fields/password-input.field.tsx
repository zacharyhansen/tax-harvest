import type { BaseFieldProps } from '../form-builder.types';

import { type InputProps } from '@repo/ui/components/input';
import { PasswordInput } from '@repo/ui/components/password-input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';

export default function PasswordInputField({
  name,
  label,
  description,
  ...props
}: Readonly<BaseFieldProps & InputProps>) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <PasswordInput {...props} {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
