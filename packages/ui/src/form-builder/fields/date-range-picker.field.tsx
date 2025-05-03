import type { DateRangePickerProps } from '@repo/ui/components/date-range-picker';
import type { BaseInputPropsUnion } from '@repo/ui/components/input.types';

import type { BaseFieldProps } from '../form-builder.types';
import {
  DateRangePicker,

} from '@repo/ui/components/date-range-picker';

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
export default function DateRangePickerField({
  name,
  label,
  description,
  ...props
}: Readonly<BaseFieldProps & Pick<DateRangePickerProps, BaseInputPropsUnion>>) {
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
              <DateRangePicker {...props} {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
