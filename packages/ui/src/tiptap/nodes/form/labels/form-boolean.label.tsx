import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@repo/ui/components/form';
import { Label } from '@repo/ui/components/label';
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogContent,
} from '@repo/ui/components/reponsive-dialog';
import { Switch } from '@repo/ui/components/switch';
import CheckboxField from '@repo/ui/form-builder/fields/checkbox.field';
import InputField from '@repo/ui/form-builder/fields/input.field';
import SwitchField from '@repo/ui/form-builder/fields/switch.field';
import TextareaField from '@repo/ui/form-builder/fields/textarea.field';
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import type { BooleanNodeAttributes } from '../types';
import {
	Footer,
	Header,
	InfoAndDeleteIcons,
	LabelInput,
	PencilIcon,
} from './common';
import { useFormLabel } from './use-form-label';

const formSchema = z.object({
	name: z.string().min(5),
	label: z.string().min(1),
	defaultValue: z.boolean(),
	description: z.string(),
	required: z.boolean(),
	nameLocked: z.boolean(),
});

export function FormBooleanLabel(props: NodeViewProps) {
	const { node, editor } = props;

	const { label, required, name, defaultValue, description, nameLocked } =
		node.attrs as BooleanNodeAttributes;
	const { isEditable } = editor;

	const [open, setOpen] = useState(false);
	const { form, handleSubmit, handleKeyDown, handleOpen } = useFormLabel({
		schema: formSchema,
		setOpen,
		defaultValues: {
			name,
			label,
			defaultValue,
			description,
			required,
			nameLocked,
		},
		...props,
	});

	const { formState } = form;

	return (
		<NodeViewWrapper className="relative flex min-h-[18.5px] items-center text-lg font-medium text-gray-900">
			<LabelInput {...props} onKeyDown={handleKeyDown} />
			<div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100">
				{isEditable ? (
					<ResponsiveDialog open={open} onOpenChange={handleOpen}>
						<PencilIcon />
						<ResponsiveDialogContent>
							<FormProvider {...form}>
								<form
									onSubmit={form.handleSubmit(handleSubmit)}
									className="flex flex-col space-y-4"
								>
									<Header />
									<ResponsiveDialogBody className="flex flex-col space-y-2">
										<SwitchField
											name="required"
											label="Required"
											description="Is a value required for this field to submit?."
										/>
										<InputField
											name="label"
											label="Label"
											description="The label of the field."
										/>
										<InputField
											name="name"
											label={
												<div className="flex items-center">
													<Label htmlFor="name">Slug</Label>
													<div className="ml-auto">
														<FormField
															name="nameLocked"
															render={({ field }) => (
																<FormItem className="flex flex-row items-center space-x-2">
																	<FormLabel>Locked?</FormLabel>
																	<FormControl>
																		<Switch
																			checked={field.value}
																			onCheckedChange={field.onChange}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
												</div>
											}
											description="This is the slug/key the value will appear under in the submit payload of the form. It must follow the 'snake_case' convention. Lock the field if you want it to remain the same when changing the label."
										/>
										<TextareaField
											name="description"
											label="Description"
											description="The description of the field that describes its purppose/context."
										/>
										<InputField
											name="placeholder"
											label="Placeholder"
											description="The muted value that shows in the field when it is empty."
										/>
										<CheckboxField
											name="defaultValue"
											label="Default Value"
											description="A value to pre-populate the field with when the form is loaded."
										/>
									</ResponsiveDialogBody>
									<Footer isDirty={formState.isDirty} setOpen={setOpen} />
								</form>
							</FormProvider>
						</ResponsiveDialogContent>
					</ResponsiveDialog>
				) : null}

				<InfoAndDeleteIcons
					name={name}
					defaultValue={defaultValue}
					{...props}
				/>
			</div>
		</NodeViewWrapper>
	);
}
