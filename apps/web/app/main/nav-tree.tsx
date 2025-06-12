import type { NavGroup } from '@repo/ui/layouts/dashboard';
import {
  Logs,
  Merge,
  NotebookText,
  Play,
  Scissors,
  Settings,
  UserPlus,
  Users,
  Wallet2,
  Waypoints,
  Wheat,
} from 'lucide-react';

import { TypedRoutes } from '~/lib/routes';

export const NavTree: NavGroup[] = [
  {
    title: 'Portfolio',
    items: [
      {
        title: 'Dashboard',
        url: TypedRoutes.home(),
        icon: Wallet2,
      },
      {
        title: 'Tax Opportunities',
        url: TypedRoutes.taxOpportunities(),
        icon: Scissors,
      },
      {
        title: 'Harvests',
        url: TypedRoutes.harvests(),
        icon: Wheat,
      },
      {
        title: 'Invite',
        url: TypedRoutes.invite(),
        icon: UserPlus,
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
        title: 'Settings',
        url: TypedRoutes.settings(),
        icon: Settings,
      },
    ],
  },

  {
    title: 'Admin',
    roles: ['admin'],
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
      {
        title: 'Plaid History',
        url: TypedRoutes.plaidHistory(),
        icon: Merge,
      },
      {
        title: 'Users',
        url: TypedRoutes.users(),
        icon: Users,
      },
      {
        title: 'Transactions',
        url: TypedRoutes.transactions(),
        icon: NotebookText,
      },
    ],
  },
];
