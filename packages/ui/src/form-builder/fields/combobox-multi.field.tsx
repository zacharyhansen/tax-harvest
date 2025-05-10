import type { ComboboxMultiProps } from "@repo/ui/components/combobox-multi";

import type { BaseFieldProps } from "../form-builder.types";
import { ComboboxMulti } from "@repo/ui/components/combobox-multi";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { useFormContext } from "react-hook-form";

/**
 * CONTROLLED
 */
export default function ComboboxMultiField({
  name,
  label,
  description,
  ...props
}: Readonly<
  BaseFieldProps & Pick<ComboboxMultiProps, "options" | "placeholder">
>) {
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
              <div>
                <ComboboxMulti {...props} {...field} />
              </div>
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
