import {
  Logs,
  NotebookText,
  Play,
  Settings,
  Wallet2,
  Waypoints,
  Wheat,
} from 'lucide-react';
import { type NavGroup } from '@repo/ui/layouts/dashboard';

import { TypedRoutes } from '~/lib/routes';

export const NavTree: NavGroup[] = [
  {
    title: 'Harvest',
    items: [
      {
        title: 'Portfolio',
        url: TypedRoutes.home(),
        icon: Wallet2,
      },
      {
        title: 'Harvests',
        url: TypedRoutes.harvests(),
        icon: Wheat,
      },
      {
        title: 'Transactions',
        url: TypedRoutes.transactions(),
        icon: NotebookText,
      },
    ],
  },
  {
    title: 'Manage',
    items: [
      {
        title: 'Accounts',
        url: TypedRoutes.accounts(),
        icon: Waypoints,
      },
      {
        title: 'Portfolio Settings',
        url: TypedRoutes.portfolios(),
        icon: Settings,
      },
    ],
  },

  {
    title: 'Admin',
    items: [
      {
        title: 'Actions',
        url: TypedRoutes.actions(),
        icon: Play,
      },
      {
        title: 'Logs',
        url: TypedRoutes.logs(),
        icon: Logs,
      },
    ],
  },
];
