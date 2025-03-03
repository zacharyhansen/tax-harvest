import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './label';

const meta = {
  title: 'Atoms/Label',
  args: {
    children: 'Shadcn',
  },
  tags: ['autodocs'],
  component: args => <Label {...args}>{args.children}</Label>,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<React.ComponentPropsWithRef<'label'>>;

export default meta;

type Story = StoryObj<typeof meta>;

//render componente
export const LabelDefault: Story = {
  args: {},
};
