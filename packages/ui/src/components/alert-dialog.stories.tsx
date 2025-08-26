import type { Meta, StoryObj } from '@storybook/react-vite';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './alert-dialog';

const meta = {
	title: 'Atoms/Alert',
	component: () => {
		return (
			<AlertDialog>
				<AlertDialogTrigger data-testid="trigger">Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle data-testid="title">
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription data-testid="description">
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel data-testid="cancel">Cancel</AlertDialogCancel>
						<AlertDialogAction data-testid="Action" variant="default">
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	},
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<object>;

export default meta;

type Story = StoryObj<object>;

export const AlertDialogDemo: Story = {
	args: {},
};
