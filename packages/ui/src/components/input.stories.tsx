import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import type { InputProps } from './input';
import { Input } from './input';

const meta = {
  title: 'Atoms/Input',
  component: args => <Input {...args} />,
  tags: ['autodocs'],
  args: {
    type: 'text',
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: [
        'file',
        'email',
        'password',
        'text',
        'checkbox',
        'radio',
        ' date',
        'datetime-local',
        'email',
        'hidden',
        'image',
        'month',
        'number',
        'password',
        'range',
        'reset',
        'search',
        'submit',
        'tel',
        'time',
        'url',
        'week',
      ],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<InputProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InputDefault: Story = {
  args: {
    type: 'text',
    placeholder: 'Name',
  },
};

export const InputDisabled: Story = {
  args: {
    disabled: true,
  },
  render: function (args) {
    return <Input type="email" placeholder="Email" {...args} />;
  },
};

export const InputWithLabel: Story = {
  args: {},
  render: function (args) {
    return <Input type="email" {...args} label="Email" />;
  },
};

export const InputWithButton: Story = {
  args: {},
  render: function () {
    return (
      <Input
        type="email"
        placeholder="Email"
        actionElement={<Button type="submit">Subscribe</Button>}
      />
    );
  },
};

export const KitchenSink: Story = {
  args: {},
  render: function () {
    return (
      <Input
        type="email"
        label="Email"
        placeholder="Email"
        actionElement={<Button type="submit">Subscribe</Button>}
      />
    );
  },
};
