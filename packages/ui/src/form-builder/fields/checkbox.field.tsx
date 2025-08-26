import { Checkbox } from '@repo/ui/components/checkbox';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/ui/components/form';
import type { BaseFieldProps } from '../form-builder.types';

export default function CheckboxField({
	name,
	label,
	description,
}: Readonly<BaseFieldProps>) {
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
					<FormControl>
						<Checkbox checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
					<div className="space-y-1 leading-none">
						<FormLabel>{label}</FormLabel>
						<FormDescription>{description}</FormDescription>
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
}
