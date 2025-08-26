import type { ComboboxProps } from '@repo/ui/components/combobox';
import { Combobox } from '@repo/ui/components/combobox';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/ui/components/form';
import { useFormContext } from 'react-hook-form';
import type { BaseFieldProps } from '../form-builder.types';

/**
 * CONTROLLED
 */
export default function ComboboxField({
	name,
	label,
	description,
	...props
}: Readonly<
	BaseFieldProps & Pick<ComboboxProps, 'options' | 'placeholder' | 'filter'>
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
								<Combobox {...props} {...field} />
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
