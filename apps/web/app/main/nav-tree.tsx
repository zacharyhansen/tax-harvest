import {
  CircuitBoard,
  DatabaseZap,
  GitFork,
  Goal,
  Handshake,
  HardDrive,
  IdCard,
  Layers3,
  LayoutDashboard,
  ListTodo,
  Puzzle,
  Settings,
  TrendingUpDown,
  Users,
} from 'lucide-react';
import { type NavGroup } from '@repo/ui/layouts/dashboard';

import { TypedRoutes } from '~/lib/routes';

export const NavTree: NavGroup[] = [
  {
    title: 'Platform',
    items: [
      {
        title: 'Home',
        url: TypedRoutes.home(),
        icon: LayoutDashboard,
      },
      {
        title: 'Tasks',
        url: TypedRoutes.tasks(),
        icon: ListTodo,
      },
      {
        title: 'Deals',
        url: TypedRoutes.opportunities(),
        icon: Handshake,
      },
    ],
  },
  {
    title: 'Organization',
    items: [
      {
        title: 'Users',
        url: TypedRoutes.users(),
        icon: Users,
      },
      {
        title: 'Roles',
        url: TypedRoutes.roles(),
        icon: IdCard,
      },
      {
        title: 'Settings',
        url: TypedRoutes.settings(),
        icon: Settings,
      },
    ],
  },
  {
    title: 'Configure',
    items: [
      {
        title: 'State Machines',
        url: TypedRoutes.stateMachines(),
        icon: CircuitBoard,
      },
      {
        url: TypedRoutes.goals(),
        icon: Goal,
        title: 'Goals',
      },
      {
        title: 'Views',
        url: TypedRoutes.views(),
        icon: Layers3,
      },
      {
        title: 'Components',
        url: TypedRoutes.components(),
        icon: Puzzle,
      },
      {
        title: 'Data',
        url: TypedRoutes.data(),
        icon: HardDrive,
        items: [
          {
            title: 'Data Tree',
            url: TypedRoutes.data(),
            icon: GitFork,
          },
          {
            title: 'Rules',
            url: '#',
            icon: TrendingUpDown,
          },
          {
            title: 'Query Playground',
            url: TypedRoutes.views() + '/playground',
            icon: DatabaseZap,
          },
        ],
      },
    ],
  },
];
