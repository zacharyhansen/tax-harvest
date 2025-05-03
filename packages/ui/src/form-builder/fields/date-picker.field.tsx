import type { DatePickerProps } from '@repo/ui/components/date-picker';
import type { BaseInputPropsUnion } from '@repo/ui/components/input.types';

import type { BaseFieldProps } from '../form-builder.types';
import {
  DatePicker,

} from '@repo/ui/components/date-picker';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { useFormContext } from 'react-hook-form';

/**
 * CONTROLLED
 */
export default function DatePickerField({
  name,
  label,
  description,
  ...props
}: Readonly<BaseFieldProps & Pick<DatePickerProps, BaseInputPropsUnion>>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <DatePicker {...props} {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
