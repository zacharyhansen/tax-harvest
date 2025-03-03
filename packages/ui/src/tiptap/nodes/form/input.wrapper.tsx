import { type NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNode } from 'react';

import { FormTextLabel } from './labels/form-text.label';
import { FormNumberLabel } from './labels/form-number.label';
import {
  formCommandIcon,
  formCommandLabel,
  type BaseFormNodeAttributes,
  FormNode,
} from './types';
import { FormComboboxLabel } from './labels/form-combobox.label';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';

export const InputWrapper = (
  props: NodeViewProps & { children: ReactNode; type: FormNode }
) => {
  const { node, type, children } = props;
  const { description } = node.attrs as BaseFormNodeAttributes;
  const Icon = formCommandIcon[node.type.name as FormNode];

  return (
    <NodeViewWrapper className="form-text-node group relative mb-2">
      {type === FormNode.Text ? <FormTextLabel {...props} /> : null}
      {type === FormNode.Number ? <FormNumberLabel {...props} /> : null}
      {type === FormNode.Combobox ? <FormComboboxLabel {...props} /> : null}
      {children}
      {description ? (
        <p className="text-muted-foreground text-xs">{description}</p>
      ) : null}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-0 top-1/2 translate-x-full pl-4 opacity-0 group-hover:opacity-100">
            <Icon size={24} className="bg-muted rounded-lg p-1" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{formCommandLabel[node.type.name as FormNode]}</p>
        </TooltipContent>
      </Tooltip>
    </NodeViewWrapper>
  );
};
