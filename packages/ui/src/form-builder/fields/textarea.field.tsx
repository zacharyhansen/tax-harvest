import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/ui/components/form';
import { Textarea } from '@repo/ui/components/textarea';
import type { BaseFieldProps } from '../form-builder.types';

export default function TextareaField({
	name,
	label,
	description,
	...props
}: Readonly<BaseFieldProps>) {
	return (
		<FormField
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<Textarea {...props} {...field} />
						</FormControl>
						<FormDescription>{description}</FormDescription>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
