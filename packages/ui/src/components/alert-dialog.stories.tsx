import type { Meta, StoryObj } from '@storybook/react';

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
            <AlertDialogAction data-testid="Action">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
  parameters: {
    layout: 'centered',
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
} satisfies Meta<{}>;

export default meta;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Story = StoryObj<{}>;

export const AlertDialogDemo: Story = {
  args: {},
};
