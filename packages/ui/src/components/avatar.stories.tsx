import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

// meta
const meta = {
	title: 'Atoms/Avatar',
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>Shadcn</AvatarFallback>
		</Avatar>
	),
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<object>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AvatarWithImage: Story = {
	args: {},
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>Shadcn</AvatarFallback>
		</Avatar>
	),
};
export const AvatarWithFallback: Story = {
	args: {},
	render: () => (
		<Avatar>
			<AvatarImage src="" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
};
