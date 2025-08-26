// src/components/multi-select.tsx

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@repo/ui/components/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@repo/ui/components/popover';
import { Separator } from '@repo/ui/components/separator';
import { cn } from '@repo/ui/utils';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDown, XIcon } from 'lucide-react';
import * as React from 'react';
import type { ComboboxOption } from './combobox';
import type { BaseInputProps } from './input.types';
import { Label } from './label';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const comboboxMultiVariants = cva(
	'm-1 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110',
	{
		variants: {
			variant: {
				default:
					'border-foreground/10 bg-card text-foreground hover:bg-card/80',
				secondary:
					'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				inverted: 'inverted',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

/**
 * Props for MultiSelect component
 */
export type ComboboxMultiProps = {
	/**
	 * An array of option objects to be displayed in the multi-select component.
	 * Each option object has a label, value, and an optional icon.
	 */
	options: ComboboxOption[];

	/**
	 * Callback function triggered when the selected values change.
	 * Receives an array of the new selected values.
	 */
	onChange: (value: string[]) => void;

	/**
	 * Animation duration in seconds for the visual effects (e.g., bouncing badges).
	 * Optional, defaults to 0 (no animation).
	 */
	animation?: number;

	/**
	 * Maximum number of items to display. Extra selected items will be summarized.
	 * Optional, defaults to 3.
	 */
	maxCount?: number;

	/**
	 * The modality of the popover. When set to true, interaction with outside elements
	 * will be disabled and only popover content will be visible to screen readers.
	 * Optional, defaults to false.
	 */
	modalPopover?: boolean;

	/**
	 * If true, renders the multi-select component as a child of another component.
	 * Optional, defaults to false.
	 */
	asChild?: boolean;

	/**
	 * Additional class names to apply custom styles to the multi-select component.
	 * Optional, can be used to add custom styles.
	 */
	className?: string;
	label?: React.ReactNode;
	description?: React.ReactNode;
	value: string[];
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> &
	VariantProps<typeof comboboxMultiVariants> &
	BaseInputProps;

export const ComboboxMulti = ({
	ref,
	onChange: onValueChange,
	value: values,
	options,
	variant,
	placeholder = 'Select options',
	animation = 0,
	maxCount = 3,
	modalPopover = false,
	asChild = true,
	className,
	description,
	label,
	...props
}: ComboboxMultiProps & {
	ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setIsPopoverOpen(true);
		} else if (
			event.key === 'Backspace' &&
			!event.currentTarget.value &&
			!props.disabled
		) {
			const newSelectedValues = [...values];
			newSelectedValues.pop();
			onValueChange(newSelectedValues);
		}
	};

	const toggleOption = (option: string) => {
		const newSelectedValues = values.includes(option)
			? values.filter((value) => value !== option)
			: [...values, option];
		onValueChange(newSelectedValues);
	};

	const handleClear = () => {
		onValueChange([]);
	};

	const handleTogglePopover = () => {
		setIsPopoverOpen((previous) => !previous);
	};

	const clearExtraOptions = () => {
		const newSelectedValues = values.slice(0, maxCount);
		onValueChange(newSelectedValues);
	};

	const toggleAll = () => {
		if (values.length === options.length) {
			handleClear();
		} else {
			const allValues = options.map((option) => option.value);
			onValueChange(allValues);
		}
	};

	return (
		<div>
			<Popover
				open={isPopoverOpen}
				onOpenChange={setIsPopoverOpen}
				modal={modalPopover}
			>
				<PopoverTrigger asChild={asChild}>
					<div>
						{label ? <Label>{label}</Label> : null}
						<Button
							ref={ref}
							{...props}
							onClick={handleTogglePopover}
							className={cn(
								'flex h-auto min-h-10 w-full min-w-[240px] items-center justify-between',
								className,
							)}
							variant="outline"
						>
							{values.length > 0 ? (
								<div className="flex w-full items-center justify-between">
									<div className="flex flex-wrap items-center">
										{values.slice(0, maxCount).map((value) => {
											const option = options.find((o) => o.value === value);
											const IconComponent = option?.icon;
											return (
												<Badge
													key={value}
													className={cn(comboboxMultiVariants({ variant }))}
													style={{ animationDuration: `${animation}s` }}
												>
													{IconComponent && (
														<IconComponent className="mr-2 size-4" />
													)}
													{option?.label}
													{props.disabled ? null : (
														<XIcon
															className="ml-2 size-4 cursor-pointer"
															onClick={(event) => {
																event.stopPropagation();
																event.preventDefault();
																toggleOption(value);
															}}
														/>
													)}
												</Badge>
											);
										})}
										{values.length > maxCount && (
											<Badge
												className={cn(
													'text-foreground border-foreground/1 bg-transparent hover:bg-transparent',
													comboboxMultiVariants({ variant }),
												)}
												style={{ animationDuration: `${animation}s` }}
											>
												{`+ ${values.length - maxCount} more`}
												<XIcon
													className="ml-2 size-4 cursor-pointer"
													onClick={(event) => {
														event.stopPropagation();
														clearExtraOptions();
													}}
												/>
											</Badge>
										)}
									</div>
									<div className="flex items-center justify-between">
										{props.disabled ? null : (
											<>
												<XIcon
													className="text-muted-foreground mx-2 h-4 cursor-pointer"
													onClick={(event) => {
														event.stopPropagation();
														handleClear();
													}}
												/>
												<Separator
													orientation="vertical"
													className="flex h-full min-h-6"
												/>
											</>
										)}
										<ChevronDown className="text-muted-foreground mx-2 h-4 cursor-pointer" />
									</div>
								</div>
							) : (
								<div className="mx-auto flex w-full items-center justify-between">
									<span className="text-muted-foreground">{placeholder}</span>
									<ChevronDown className="text-muted-foreground h-4 cursor-pointer" />
								</div>
							)}
						</Button>
					</div>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0"
					align="start"
					onEscapeKeyDown={() => {
						setIsPopoverOpen(false);
					}}
				>
					<Command>
						<CommandInput
							placeholder="Search..."
							onKeyDown={handleInputKeyDown}
						/>
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								<CommandItem
									key="all"
									onSelect={toggleAll}
									disabled={props.disabled}
									className="cursor-pointer"
								>
									<div
										className={cn(
											'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
											values.length === options.length
												? 'bg-primary text-primary-foreground'
												: 'opacity-50 [&_svg]:invisible',
										)}
									>
										<CheckIcon className="size-4" />
									</div>
									<span>(Select All)</span>
								</CommandItem>
								{options.map((option) => {
									const isSelected = values.includes(option.value);
									return (
										<CommandItem
											disabled={props.disabled}
											key={option.value}
											onSelect={() => {
												toggleOption(option.value);
											}}
											className="cursor-pointer"
										>
											<div
												className={cn(
													'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
													isSelected
														? 'bg-primary text-primary-foreground'
														: 'opacity-50 [&_svg]:invisible',
												)}
											>
												<CheckIcon className="size-4" />
											</div>
											{option.icon && (
												<option.icon className="text-muted-foreground mr-2 size-4" />
											)}
											<span>{option.label}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<div className="flex items-center justify-between">
									{values.length > 0 && !props.disabled && (
										<>
											<CommandItem
												onSelect={handleClear}
												className="flex-1 cursor-pointer justify-center"
											>
												Clear
											</CommandItem>
											<Separator
												orientation="vertical"
												className="flex h-full min-h-6"
											/>
										</>
									)}
									<CommandItem
										onSelect={() => {
											setIsPopoverOpen(false);
										}}
										className="max-w-full flex-1 cursor-pointer justify-center"
									>
										Close
									</CommandItem>
								</div>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className="text-muted-foreground pt-1 text-xs">
				{description || null}
			</div>
		</div>
	);
};

ComboboxMulti.displayName = 'ComboboxMulti';
