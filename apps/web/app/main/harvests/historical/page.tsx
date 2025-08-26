'use client';

import { Badge } from '@repo/ui/components/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import UserCell from '@repo/ui/components/dataTable/cells/userCell';
import type { ColDef } from 'ag-grid-community';
import { capitalCase } from 'change-case';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	type HarvestTableItemFragment,
	useHarvestsQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import GridTable from '~/modules/client-ag-grid/grid-table';
import { LoadingPage } from '~/modules/utility-components';

const columnDefs: ColDef<HarvestTableItemFragment>[] = [
	{
		headerName: 'Name',
		field: 'label',
		flex: 1,
	},
	{
		headerName: 'Amount',
		field: 'amount',
		cellDataType: 'usd',
	},
	{
		headerName: 'Status',
		field: 'step',
		cellDataType: 'status',
	},
	{
		headerName: 'Type',
		field: 'type',
		cellRenderer: ({ data }: { data: HarvestTableItemFragment }) => (
			<Badge>{capitalCase(data.type)}</Badge>
		),
	},
	{ headerName: 'Harvest Date', field: 'date', cellDataType: 'date' },
	{ headerName: 'Created By', field: 'createdBy', cellRenderer: UserCell },
	{ headerName: 'Created At', field: 'createdAt', cellDataType: 'date' },
];

export default function HarvestsPage() {
	const router = useRouter();
	const { data, loading } = useHarvestsQuery();
	if (loading) {
		<LoadingPage />;
	}

	if (!data?.harvests?.length) {
		return (
			<div className="grow pt-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
				>
					<Card>
						<CardHeader className="flex flex-row items-center gap-2 pb-2">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									delay: 0.2,
									duration: 0.4,
									type: 'spring',
									stiffness: 260,
									damping: 20,
								}}
							>
								<History className="text-muted-foreground h-5 w-5" />
							</motion.div>
							<CardTitle className="text-lg">No Historical Harvests</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.p
								className="text-muted-foreground text-sm"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3, duration: 0.5 }}
							>
								Your completed tax-loss harvesting transactions will appear
								here. Start harvesting opportunities from your portfolio to
								build your history.
							</motion.p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="grow pt-4">
			<GridTable<HarvestTableItemFragment>
				rowData={data?.harvests}
				columnDefs={columnDefs}
				loading={loading}
				onRowClicked={(row) => {
					router.push(TypedRoutes.harvest({ id: row?.data?.id ?? '' }));
				}}
			/>
		</div>
	);
}
