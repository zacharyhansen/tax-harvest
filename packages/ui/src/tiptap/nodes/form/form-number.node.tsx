import { Input } from '@repo/ui/components/input';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { generateRandomFieldName } from '../../utils';
import type { NumberNodeAttributes } from '../form/types';
import { FormNode } from '../form/types';

import { useFormKeyDown } from './hooks/use-form-key-down';
import { InputWrapper } from './input.wrapper';

export const FormNumberNode = Node.create<NumberNodeAttributes>({
	name: FormNode.Number, // Unique name for your node
	group: 'block', // Allow it to act like a block element
	atom: true, // Treat as a single unit (atomic)

	addAttributes() {
		return {
			name: { default: generateRandomFieldName('field', 10) },
			label: { default: '' },
			defaultValue: { default: '' },
			placeholder: { default: '' },
			required: { default: true },
			description: { default: '' },
			nameLocked: { default: false },
		};
	},

	parseHTML() {
		return [
			{
				tag: 'form-number-node',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ['form-number-node', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return ReactNodeViewRenderer((props) => {
			const { node, updateAttributes } = props;
			const { placeholder } = node.attrs as NumberNodeAttributes;
			const { handleKeyDown } = useFormKeyDown(props);

			if (!props.editor.isEditable) {
				return (
					<InputField
						type="number"
						{...(props.node.attrs as NumberNodeAttributes)}
					/>
				);
			}

			return (
				<InputWrapper {...props} type={FormNode.Number}>
					<Input
						placeholder="Type placeholder text"
						onChange={(event) => {
							updateAttributes({ placeholder: event.target.value });
						}}
						onKeyDown={handleKeyDown}
						value={placeholder}
						className="text-muted-foreground transition-all duration-200 placeholder:text-transparent focus:outline-hidden focus:placeholder:text-gray-400"
					/>
				</InputWrapper>
			);
		});
	},
});
