'use client';

import { Button } from '@repo/ui/components/button';
import DataTable from '@repo/ui/components/dataTable/dataTable';
import Link from 'next/link';
import { Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';

import columns from './Harvests.ColumnDef';

import { TypedRoutes } from '~/lib/routes';
import { HarvestStep, useHarvestsQuery } from '~/generated/gql';
import PageWrapper from '~/modules/layout/page-wrapper';
import { LoadingPage } from '~/modules/utility-components';

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
      cornerElement={
        <Link href={TypedRoutes.harvestFlowRoot()}>
          <Button iconLeft={<Wheat className="h-4 w-4" />}>New Harvest</Button>
        </Link>
      }
    >
      <DataTable
        data={data?.harvests}
        columns={columns}
        noResultsAlert="No Harvests Found."
        onRowClick={row => {
          if (row) {
            if (row.original.step === HarvestStep.Complete) {
              router.push(TypedRoutes.harvest({ id: row.original.id }));
            } else {
              router.push(
                TypedRoutes.harvestFlowType({
                  harvestId: row.original.id,
                  type: row.original.type,
                })
              );
            }
          }
        }}
      />
    </PageWrapper>
  );
}
