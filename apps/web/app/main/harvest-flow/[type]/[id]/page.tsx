import { HarvestType } from 'generated/gql';
import { HarvestStepper } from 'modules/harvest';

export default async function Page({
  params,
}: {
  params: { type: HarvestType; id: string };
}) {
  const harvestType = (await params).type;
  const harvestId = (await params).id;
  return (
    <HarvestStepper
      harvestType={harvestType || HarvestType.ReduceTaxes}
      harvestId={harvestId}
    />
  );
}
