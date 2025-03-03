import type { Meta, StoryObj } from '@storybook/react';
import {
  Component,
  Goal,
  Handshake,
  Layers3,
  LayoutDashboard,
  ListTodo,
  Network,
} from 'lucide-react';

import { Button } from '../components/button';

import { Dashboard } from './dashboard';
import type { NavItem } from './components/nav-main';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb';

const meta = {
  title: 'Molecules/Dashboard',
  component: Dashboard,
  args: {
    navGroups: [
      {
        title: 'Platform',
        items: [
          {
            title: 'Dashboard',
            url: '#',
            icon: LayoutDashboard,
          },
          {
            title: 'Tasks',
            url: '#',
            icon: ListTodo,
          },
          {
            title: 'Deals',
            url: '#',
            icon: Handshake,
          },
        ] satisfies NavItem[],
      },
      {
        title: 'Configure',
        items: [
          {
            title: 'Data Tree',
            url: '#',
            icon: Network,
          },
          {
            url: '#',
            icon: Component,
            title: 'Layouts',
          },
          {
            url: '#',
            icon: Goal,
            title: 'Goals',
          },
          {
            title: 'Views',
            url: '#',
            icon: Layers3,
            items: [
              {
                title: 'Query Playground',
                url: '#',
                icon: Network,
              },
              {
                title: 'Tables',
                url: '#',
                icon: Network,
              },
              {
                title: 'Rules',
                url: '#',
                icon: Network,
              },
            ],
          },
        ] satisfies NavItem[],
      },
    ],
    children: (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    ),
    sidebarOptions: <Button size="icon">B</Button>,
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
