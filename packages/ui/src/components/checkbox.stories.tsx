import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxField } from './checkbox';

const meta = {
  title: 'Atoms/Checkboxfield',
  component: CheckboxField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
  args: {},
};

export const Label: Story = {
  args: { label: 'Label', id: 'test' },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    description: 'I am a description for the text box field.',
    disabled: true,
    id: 'disabled',
  },
};

export const KitchedSink: Story = {
  args: {
    label: 'Label',
    id: 'kitchenSink',
    description: 'I am a description for the text box field.',
  },
};
