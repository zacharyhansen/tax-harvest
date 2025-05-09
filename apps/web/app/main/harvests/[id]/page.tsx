import { PageWrapper } from '~/modules/layout';

type HarvestPageProps = {
  params: Promise<{
    id: Promise<string>;
  }>;
};

export default async function HarvestPage(props: HarvestPageProps) {
  const params = await props.params;
  const harvestId = await params.id;
  return (
    <PageWrapper title="Harvest Details">
      {harvestId}
      {/* <Review harvestId={harvestId} /> */}
    </PageWrapper>
  );
}
