import { zodResolver } from '@hookform/resolvers/zod';
import type { NodeViewProps } from '@tiptap/core';
import { snakeCase } from 'change-case';
import { useEffect } from 'react';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { ZodType, z } from 'zod';

export function useFormLabel<
	// biome-ignore lint/suspicious/noExplicitAny: <ok>
	FormSchema extends ZodType<any, any, any>,
	TFieldValues extends FieldValues & {
		name: string;
		label: string;
	},
>({
	schema,
	editor,
	getPos,
	node,
	updateAttributes,
	setOpen,
	defaultValues,
}: {
	schema: FormSchema;
	setOpen: (open: boolean) => void;
	defaultValues:
		| DefaultValues<TFieldValues>
		| ((payload?: unknown) => Promise<TFieldValues>);
} & NodeViewProps) {
	const nodeEndPos = getPos() + node.nodeSize;

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			editor
				.chain()
				.focus(nodeEndPos)
				.insertContent([
					{
						type: 'paragraph',
					},
				])
				.run();
		}
	};

	const form = useForm<z.infer<FormSchema>>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const { watch, setValue } = form;

	const handleSubmit = (values: z.infer<FormSchema>) => {
		try {
			updateAttributes(values);
			setOpen(false);
			toast.success('Saved');
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to save. Please try again.');
		}
	};

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === 'label' && !value.nameLocked && value.label) {
				// @ts-expect-error cant get the types to always include name and label
				setValue('name', snakeCase(value.label));
			}
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [watch, setValue]);

	const handleOpen = (open: boolean) => {
		// Whenever we open the form we need to reset to the current nodes values
		if (open) {
			form.reset(defaultValues);
		}
		setOpen(open);
	};

	return { handleKeyDown, handleSubmit, form, handleOpen };
}
