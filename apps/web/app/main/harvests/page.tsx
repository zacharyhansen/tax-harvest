'use client';

import { Button } from '@repo/ui/components/button';
import DataTable from '@repo/ui/components/dataTable/dataTable';
import { Wheat } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { HarvestStep, useHarvestsQuery } from '~/generated/gql';

import { TypedRoutes } from '~/lib/routes';
import PageWrapper from '~/modules/layout/page-wrapper';
import { LoadingPage } from '~/modules/utility-components';
import columns from './Harvests.ColumnDef';

export default function HarvestsPage() {
  const router = useRouter();
  const { data, loading } = useHarvestsQuery();
  if (loading) {
    <LoadingPage />;
  }

  return (
    <PageWrapper
      title="Harvests"
      description="Below are all harvests for your portfolio. You can continue an incomplete harvest by selecting it."
      cornerElement={(
        <Link href={TypedRoutes.harvestFlowRoot()}>
          <Button iconLeft={<Wheat className="size-4" />}>New Harvest</Button>
        </Link>
      )}
    >
      <DataTable
        data={data?.harvests}
        columns={columns}
        noResultsAlert="No Harvests Found."
        onRowClick={(row) => {
          if (row) {
            if (row.original.step === HarvestStep.Complete) {
              router.push(TypedRoutes.harvest({ id: row.original.id }));
            } else {
              router.push(
                TypedRoutes.harvestFlowType({
                  harvestId: row.original.id,
                  type: row.original.type,
                }),
              );
            }
          }
        }}
      />
    </PageWrapper>
  );
}
