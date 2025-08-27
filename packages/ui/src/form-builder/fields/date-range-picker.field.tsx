import type { DateRangePickerProps } from '@repo/ui/components/date-range-picker';
import { DateRangePicker } from '@repo/ui/components/date-range-picker';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/ui/components/form';
import { useFormContext } from 'react-hook-form';
import type { BaseInputPropsUnion } from '../../components/input.types';
import type { BaseFieldProps } from '../form-builder.types';

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
							{/* @ts-expect-error */}
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
