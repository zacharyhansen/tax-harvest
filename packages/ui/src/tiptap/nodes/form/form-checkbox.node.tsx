import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

import { generateRandomFieldName } from '../../utils';

import { FormNode, type BooleanNodeAttributes } from './types';
import { FormBooleanLabel } from './labels/form-boolean.label';

import { CheckboxField } from '@repo/ui/components/checkbox';

// Define the FormTextNode extension
export const FormCheckboxNode = Node.create<BooleanNodeAttributes>({
  name: FormNode.Checkbox, // Unique name for your node
  group: 'block', // Allow it to act like a block element
  atom: true, // Treat as a single unit (atomic)

  addAttributes() {
    return {
      name: { default: generateRandomFieldName('field', 10) },
      label: { default: '' },
      defaultValue: { default: false },
      required: { default: true },
      description: { default: '' },
      nameLocked: { default: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'form-checkbox-node',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['form-checkbox-node', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(props => {
      const { node, updateAttributes } = props;
      const { description, defaultValue } = node.attrs as BooleanNodeAttributes;

      if (!props.editor.isEditable) {
        return <CheckboxField {...props.node.attrs} />;
      }

      return (
        <NodeViewWrapper className="group mb-2 flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4">
          <CheckboxField
            checked={defaultValue}
            onCheckedChange={() => {
              updateAttributes({ defaultValue: !defaultValue });
            }}
          />
          <div className="flex flex-col space-y-1 leading-none">
            <FormBooleanLabel {...props} />
            {description ? (
              <p className="text-muted-foreground text-xs">{description}</p>
            ) : null}
          </div>
        </NodeViewWrapper>
      );
    });
  },
});
