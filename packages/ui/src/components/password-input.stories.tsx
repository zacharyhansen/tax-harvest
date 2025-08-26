import type { Meta, StoryObj } from '@storybook/react-vite';

import { PasswordInput } from './password-input';

const meta = {
	title: 'Atoms/Password Input',
	component: PasswordInput,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	args: {
		disabled: false,
	},
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const Disabled: Story = {
	args: {},
};
