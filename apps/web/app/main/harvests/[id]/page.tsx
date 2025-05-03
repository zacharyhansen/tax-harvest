import { PageWrapper } from '~/modules/layout';

type HarvestPageProps = {
  params: {
    id: Promise<string>;
  };
};

export default async function HarvestPage({ params }: HarvestPageProps) {
  const harvestId = await params.id;
  return (
    <PageWrapper title="Harvest Details">
      {harvestId}
      {/* <Review harvestId={harvestId} /> */}
    </PageWrapper>
  );
}
