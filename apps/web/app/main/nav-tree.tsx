import type { NavGroup } from '@repo/ui/layouts/dashboard';
import {
	AlertTriangle,
	Bot,
	Building2,
	ChartArea,
	Logs,
	Merge,
	NotebookText,
	Play,
	Scissors,
	Settings,
	TrendingUpDown,
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
				title: 'Performance',
				url: TypedRoutes.performance(),
				icon: ChartArea,
				beta: true,
			},
			{
				title: 'AI Advisor',
				url: TypedRoutes.aiAdvisor(),
				icon: Bot,
				beta: true,
			},
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
				title: 'Institutions',
				url: TypedRoutes.institutions(),
				icon: Building2,
			},
			{
				title: 'Plaid Merges',
				url: TypedRoutes.plaidHistory(),
				icon: Merge,
			},
			{
				title: 'Account P&L History',
				url: TypedRoutes.accountPnlHistory(),
				icon: TrendingUpDown,
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
