import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/ui/components/form';
import type { PhoneInputProps } from '@repo/ui/components/phone-input';
import { PhoneInput } from '@repo/ui/components/phone-input';
import type { BaseFieldProps } from '../form-builder.types';

export default function PhoneInputField({
	name,
	label,
	description,
	...props
}: Readonly<BaseFieldProps & PhoneInputProps>) {
	return (
		<FormField
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<PhoneInput {...props} {...field} />
						</FormControl>
						<FormDescription>{description}</FormDescription>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
