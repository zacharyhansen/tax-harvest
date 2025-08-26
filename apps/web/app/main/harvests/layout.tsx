'use client';

import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HarvestsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const tabs = [
		{
			value: 'overview',
			label: 'Open Harvests',
			href: '/main/harvests',
		},
		{
			value: 'wash',
			label: 'Current Wash Window Harvests',
			href: '/main/harvests/wash',
		},
		{
			value: 'historical',
			label: 'All',
			href: '/main/harvests/historical',
		},
	];

	const currentTab =
		tabs.find((tab) => pathname === tab.href)?.value ?? 'overview';

	return (
		<div className="container relative mx-auto flex h-full grow flex-col p-4">
			<Tabs value={currentTab} className="">
				<TabsList className="">
					{tabs.map((tab) => (
						<Link href={tab.href} key={tab.value}>
							<TabsTrigger value={tab.value} className="min-w-24">
								{tab.label}
							</TabsTrigger>
						</Link>
					))}
				</TabsList>
			</Tabs>
			{children}
		</div>
	);
}
