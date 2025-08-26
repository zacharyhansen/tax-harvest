'use client';

import { use } from 'react';
import type { TypedRoutes } from '~/lib/routes';
import { HarvestStepper } from '~/modules/harvest';

export default function Page(props: {
	params: Promise<typeof TypedRoutes.harvestFlowType.params>;
}) {
	const params = use(props.params);
	return (
		<HarvestStepper harvestType={params.type} harvestId={params.harvestId} />
	);
}
