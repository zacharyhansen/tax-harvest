import type { TabsProps } from '@radix-ui/react-tabs';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './card';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
	title: 'Atoms/Tabs',
	args: {
		children: 'Shadcn',
	},
	tags: ['autodocs'],
	component: (_args) => (
		<Tabs defaultValue="account" className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here. Click save when you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="name">Name</Label>
							{/** biome-ignore lint/correctness/useUniqueElementIds: <ok> */}
							<Input id="name" defaultValue="Pedro Duarte" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="username">Username</Label>
							{/** biome-ignore lint/correctness/useUniqueElementIds: <ok> */}
							<Input id="username" defaultValue="@peduarte" />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save changes</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Change your password here. After saving, you'll be logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="current">Current password</Label>
							{/** biome-ignore lint/correctness/useUniqueElementIds: <ok> */}
							<Input id="current" type="password" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="new">New password</Label>
							{/** biome-ignore lint/correctness/useUniqueElementIds: <ok> */}
							<Input id="new" type="password" />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save password</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	),
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<TabsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

// render componente
export const Default: Story = {
	args: {},
};
