'use client';

import { useHarvestSingleQuery } from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';
import { HarvestCard } from '../../harvests/harvest-card';

export default function HarvestDetail({ harvestId }: { harvestId: string }) {
	const { data, loading } = useHarvestSingleQuery({
		variables: {
			id: harvestId,
		},
	});

	if (loading) {
		return <LoadingPage />;
	}

	if (!data?.harvest) {
		return <div>Harvest not found</div>;
	}

	return <HarvestCard harvest={data?.harvest} open={true} />;
}
