import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { generateRandomFieldName } from '../../utils';

import { FormNode, type ComboboxNodeAttributes } from './types';
import { InputWrapper } from './input.wrapper';
import { useFormKeyDown } from './hooks/use-form-key-down';

import { Input } from '@repo/ui/components/input';
import ComboboxField from '@repo/ui/form-builder/fields/combobox.field';

export const FormComboboxNode = Node.create<ComboboxNodeAttributes>({
  name: FormNode.Combobox, // Unique name for your node
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
      options: {
        default: [],
        parseHTML: element => {
          const json = element.dataset.options;
          try {
            return json ? JSON.parse(json) : [];
          } catch (error) {
            console.error('Failed to parse options JSON:', error);
            return [];
          }
        },
        renderHTML: attributes => {
          if (!attributes.options || !Array.isArray(attributes.options)) {
            return {};
          }
          return {
            'data-options': JSON.stringify(attributes.options),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'form-combobox-node',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['form-combobox-node', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(props => {
      const { node, updateAttributes, editor } = props;
      const { placeholder } = node.attrs as ComboboxNodeAttributes;
      const { handleKeyDown } = useFormKeyDown(props);
      console.log({ node: props.editor.isEditable });

      if (!editor.isEditable) {
        console.log('not ediotable');
        return (
          <ComboboxField {...(props.node.attrs as ComboboxNodeAttributes)} />
        );
      }

      return (
        <InputWrapper {...props} type={FormNode.Combobox}>
          <Input
            placeholder={'Type placeholder text'}
            onChange={event => {
              updateAttributes({ placeholder: event.target.value });
            }}
            onKeyDown={handleKeyDown}
            value={placeholder}
            className="text-muted-foreground transition-all duration-200 placeholder:text-transparent focus:placeholder-gray-400 focus:outline-none"
          />
        </InputWrapper>
      );
    });
  },
});
