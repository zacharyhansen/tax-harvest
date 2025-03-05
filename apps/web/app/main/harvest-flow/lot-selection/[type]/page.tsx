import { HarvestType } from 'generated/gql';
import { HarvestStepper } from 'modules/harvest';

export default async function Page({
  params,
}: {
  params: { type: HarvestType };
}) {
  const harvestType = (await params).type;
  return (
    <HarvestStepper harvestType={harvestType || HarvestType.ReduceTaxes} />
  );
}
