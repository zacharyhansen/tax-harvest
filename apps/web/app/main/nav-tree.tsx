import {
  Folders,
  LayoutDashboard,
  NotebookText,
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
        title: 'Home',
        url: TypedRoutes.home(),
        icon: LayoutDashboard,
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
        icon: Folders,
      },
    ],
  },
];
