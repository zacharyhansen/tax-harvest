import type { Meta, StoryObj } from '@storybook/react';
import type { TreeViewProps } from './tree-view';

import { Printer } from 'lucide-react';
import { Button } from './button';
import { TreeView } from './tree-view';

const meta = {
  title: 'Molecules/Tree View',
  component: args => <TreeView {...args} />,
  tags: ['autodocs'],
  args: {
    data: [
      {
        id: '1',
        name: 'Item 1',
        actions: (
          <Button
            size="icon"
            className="size-6"
            variant="ghost"
            onClick={() => {}}
          >
            <Printer width={12} height={12} />
          </Button>
        ),
        children: [
          {
            id: '2',
            name: 'Item 1.1',
            children: [
              {
                id: '3',
                name: 'Item 1.1.1',
              },
              {
                id: '4',
                name: 'Item 1.1.2',
              },
            ],
          },
          {
            id: '5',
            name: 'Item 1.2',
          },
        ],
      },
      {
        id: '6',
        name: 'Item 2',
      },
    ],
  },
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<TreeViewProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
