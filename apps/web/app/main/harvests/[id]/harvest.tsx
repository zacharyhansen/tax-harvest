import { HarvestCard } from '../harvest-card';
import { useHarvestSingleQuery } from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';

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

  return <HarvestCard harvest={data?.harvest} />;
}
