import type { Meta, StoryObj } from '@storybook/react';

import { PhoneInput } from './phone-input';

const meta = {
  title: 'Atoms/Phone Input',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
