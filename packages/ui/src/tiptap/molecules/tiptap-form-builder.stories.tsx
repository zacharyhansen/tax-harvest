import { zodResolver } from '@hookform/resolvers/zod';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Button } from '@repo/ui/components/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';

import { z } from 'zod';

import { formCommands } from '../extensions/slash-command-lists/form.commands';

import { TiptapBase } from './tiptap-base';

const meta = {
	title: 'TipTap/Molecules/Form Builder',
	args: {
		throttleDelay: 1000,
		output: 'html',
		placeholder: "Type '/' to insert blocks",
		editable: true,
		editorClassName: 'my-12 mx-24',
		onChange: (content) => {
			console.info({ content });
		},
	},
	tags: ['autodocs'],
	component: TiptapBase,
	parameters: {
		layout: 'centered',
	},
	render: (args) => {
		const [isEditable, setIsEditable] = useState(true);
		return (
			<TooltipProvider delayDuration={100}>
				<Toaster />
				<Button
					className="my-2 flex w-full space-x-4"
					onClick={() => {
						setIsEditable(false);
					}}
					size="sm"
					variant="outline"
				>
					{isEditable ? 'Edit View' : 'Read Only View'}
				</Button>
				{isEditable ? (
					<TiptapBase {...args} />
				) : (
					<TiptapBase {...args} editable={false} />
				)}
			</TooltipProvider>
		);
	},
} satisfies Meta<typeof TiptapBase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
	args: {
		slashCommands: formCommands,
		content: ``,
	},
};

export const InputBlocks: Story = {
	args: {
		editorContentClassName: 'minimal-tiptap-editor-slash-command',
		placeholder: "Press '/' for commands.",
		value: `
   <form-text-node name="field_6ZBXjmzVfZ" label="Text Input Label" defaultvalue="" placeholder="Placeholder..." required="true" description=""></form-text-node><p class="text-node">Paragraph element</p>
  `,
	},
};

const formSchema = z.object({});

export const InputBlocksRendered: Story = {
	args: {
		editorContentClassName: 'minimal-tiptap-editor-slash-command',
		placeholder: "Press '/' for commands.",
		editable: false,
		value: `
    <form-combobox-node 
      name="select_field" 
      label="Fruits" 
      defaultvalue="value" 
      placeholder="" 
      required="true" 
      description="" 
      namelocked="false" 
      data-options="[{&quot;label&quot;:&quot;label&quot;,&quot;value&quot;:&quot;value&quot;},{&quot;label&quot;:&quot;label 2&quot;,&quot;value&quot;:&quot;value 2&quot;}]"
    >
    </form-combobox-node>`,
	},
	render: (args) => {
		const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: {},
		});

		function onSubmit(values: z.infer<typeof formSchema>) {
			try {
				console.info(values);
				toast(
					<pre className="mt-2 w-[340px] rounded-lg bg-slate-950 p-4">
						<code className="text-white">
							{JSON.stringify(values, null, 2)}
						</code>
					</pre>,
				);
			} catch (error) {
				console.error('Form submission error', error);
				toast.error('Failed to submit the form. Please try again.');
			}
		}
		return (
			<TooltipProvider delayDuration={100}>
				<Toaster />
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mx-auto max-w-3xl space-y-8 py-10"
					>
						<TiptapBase {...args} />
					</form>
				</FormProvider>
			</TooltipProvider>
		);
	},
};

export const NotEditable: Story = {
	args: {
		editorContentClassName: 'minimal-tiptap-editor-slash-command',
		placeholder: "Press '/' for commands.",
		editable: false,
		value: `
    <p>This is an example of how custom input nodes appear.</p>
    <p>text</p>
  `,
	},
};
