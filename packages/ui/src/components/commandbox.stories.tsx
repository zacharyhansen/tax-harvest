import type { Meta, StoryObj } from '@storybook/react';
import { Cat, Dog, Fish, Rabbit, Turtle } from 'lucide-react';

import { CommandBox } from './commandbox';

const priorities = [
  { value: 'no-priority', label: 'No priority', icon: Cat },
  { value: 'urgent', label: 'Urgent', icon: Dog },
  { value: 'high', label: 'High', icon: Fish },
  { value: 'medium', label: 'Medium', icon: Rabbit },
  { value: 'low', label: 'Low', icon: Turtle },
];

const meta = {
  title: 'Atoms/Command Box',
  component: CommandBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    commandOptions: priorities,
  },
} satisfies Meta<typeof CommandBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
