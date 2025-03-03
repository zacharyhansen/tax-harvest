import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
} from '@repo/ui/components/reponsive-dialog';

const meta = {
  title: 'Atoms/Responsive Dialog',
  component: ResponsiveDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: (
      <>
        <ResponsiveDialogTrigger asChild>
          <Button>Open modal</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Credenza</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              A responsive modal component for shadcn/ui.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            This component is built using shadcn/ui&apos;s dialog and drawer
            component, which is built on top of Vaul. Pulled from{' '}
            https://credenza.rdev.pro/
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="secondary">Close</Button>
            </ResponsiveDialogClose>
            <Button>Do Something</Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </>
    ),
  },
} satisfies Meta<typeof ResponsiveDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
