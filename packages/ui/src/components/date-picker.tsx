'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../utils';
import { Button } from './button';
import type { CalendarProps } from './calendar';
import { Calendar } from './calendar';
import type { BaseInputPropsType } from './input.types';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type DatePickerProps = Omit<CalendarProps, 'selected'> &
	BaseInputPropsType & {
		label?: React.ReactNode;
		value?: Date;
		onChange: (value: Date) => void;
	};

export function DatePicker({
	label,
	mode = 'single',
	placeholder,
	value,
	onChange,
	...props
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div className="flex flex-col space-y-2">
					{label ? <Label>{label}</Label> : null}
					<Button
						variant="outline"
						className={cn(
							'w-full justify-start text-left font-normal',
							!value && 'text-muted-foreground',
						)}
						type="button"
						disabled={props.disabled}
					>
						<CalendarIcon className="mr-2 size-4" />
						{value ? (
							format(value, 'PPP')
						) : (
							<span>{placeholder ?? 'Pick a date'}</span>
						)}
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode={mode as 'single'}
					// biome-ignore lint/suspicious/noExplicitAny: <opk>
					onSelect={(currentValue: any) => {
						onChange(currentValue === value ? '' : currentValue);
						setOpen(false);
					}}
					selected={value as Date}
					autoFocus
					{...props}
				/>
			</PopoverContent>
		</Popover>
	);
}
