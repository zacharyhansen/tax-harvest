import type { Meta, StoryObj } from '@storybook/react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { defaultCommands } from '../extensions/slash-command-lists/default.commands';

import { TiptapBase } from './tiptap-base';

const meta = {
  title: 'TipTap/Molecules/Base',
  args: {
    throttleDelay: 1000,
    output: 'html',
    placeholder: 'Comment here...',
    editable: true,
  },
  tags: ['autodocs'],
  component: TiptapBase,
  parameters: {
    layout: 'centered',
  },
  render: args => (
    <TooltipProvider>
      <TiptapBase {...args} />
    </TooltipProvider>
  ),
} satisfies Meta<typeof TiptapBase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const SlashCommandDefault: Story = {
  args: {
    placeholder: "Press '/' for commands.",
    slashCommands: defaultCommands,
  },
};

export const Mini: Story = {
  args: {
    placeholder: "Press '/' for commands.",
    variant: 'mini',
  },
};

export const Max: Story = {
  args: {
    placeholder: "Press '/' for commands.",
    variant: 'max',
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

export const InputBlocks: Story = {
  args: {
    editorContentClassName: 'minimal-tiptap-editor-slash-command',
    placeholder: "Press '/' for commands.",
    value: `
    <p>This is an example of how custom input nodes appear.</p>
    <input-block label="Your Name" placeholder="Enter your name" />
    <p>text</p>
  `,
  },
};

export const InputBlocksRendered: Story = {
  args: {
    editorContentClassName: 'minimal-tiptap-editor-slash-command',
    placeholder: "Press '/' for commands.",
    editable: false,
    value: `
    <p>This is an example of how custom input nodes appear.</p>
    <input-block label="Your Name" placeholder="Enter your name" />
    <p>text</p>
  `,
  },
};
