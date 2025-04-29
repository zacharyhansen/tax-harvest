import Review from '~/modules/harvest/stepper/steps/Review';
import { PageWrapper } from '~/modules/layout';

interface HarvestPageProps {
  params: {
    id: Promise<string>;
  };
}

export default async function HarvestPage({ params }: HarvestPageProps) {
  const harvestId = await params.id;
  return (
    <PageWrapper title="Harvest Details">
      <Review harvestId={harvestId} />
    </PageWrapper>
  );
}
