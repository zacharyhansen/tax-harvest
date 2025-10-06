import HarvestDetail from './harvest';

type HarvestPageProps = {
	params: Promise<{
		id: Promise<string>;
	}>;
};

export default async function HarvestPage(props: HarvestPageProps) {
	const params = await props.params;
	const harvestId = await params.id;

	return (
		<div className="grow py-4">
			<HarvestDetail harvestId={harvestId} />
		</div>
	);
}
