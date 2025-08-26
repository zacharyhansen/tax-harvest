import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/ui/components/form';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/radio-group';
import type { BaseFieldProps } from '../form-builder.types';

export default function RadioGroupField({
	name,
	label,
	description,
	options,
}: Readonly<BaseFieldProps & { options: { label: string; value: string }[] }>) {
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-3">
					<FormLabel>{label}</FormLabel>
					<FormDescription>{description}</FormDescription>
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
							className="flex flex-col"
						>
							{options.map((option) => (
								<FormItem
									key={option.value}
									className="flex items-center gap-3"
								>
									<FormControl>
										<RadioGroupItem value={option.value} />
									</FormControl>
									<FormLabel className="font-normal">{option.label}</FormLabel>
								</FormItem>
							))}
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
