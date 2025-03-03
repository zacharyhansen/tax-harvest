import type { Meta, StoryObj } from '@storybook/react';

import type { BadgeProps } from './badge';
import { Badge } from './badge';

const meta = {
  title: 'Atoms/Badge',
  render: args => <Badge {...args}>{args.children}</Badge>,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    children: 'Im a badge',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'outline', 'destructive'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<BadgeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

//colors
export const Default: Story = {
  args: {
    variant: 'default',
  },
};
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};
