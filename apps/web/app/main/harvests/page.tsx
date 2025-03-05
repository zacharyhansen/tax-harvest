'use client';

import PageWrapper from '~/modules/layout/page-wrapper';

export default function HarvestsPage() {
  // if (loading) {
  //   <LoadingPage />;
  // }

  return (
    <PageWrapper
      title="Harvests"
      description="Below is all harvests for your portfolio. You can continue an incomplete harvest by selected it."
      // cornerElement={
      // <Link href={HARVEST_FLOW_ROOT}>
      //   <Button iconLeft={<Wheat className="h-4 w-4" />}>New Harvest</Button>
      // </Link>
      // }
    >
      test
      {/* <DataTable
        data={data?.harvests}
        columns={columns}
        noResultsAlert="No Harvests Found."
        onRowClick={(row) => {
          if (row) {
            if (row.original.step === HarvestStep.Complete) {
              router.push(HARVEST_ID({ id: row.original.id }));
            } else {
              router.push(
                HARVEST_FLOW({
                  harvestId: row.original.id,
                  harvestType: row.original.type,
                })
              );
            }
          }
        }}
      /> */}
    </PageWrapper>
  );
}
