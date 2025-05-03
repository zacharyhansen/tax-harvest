import type { InputProps } from '@repo/ui/components/input';

import type { BaseFieldProps } from '../form-builder.types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { PasswordInput } from '@repo/ui/components/password-input';

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
              {/* @ts-expect-error - no idea what this ref is */}
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
