'use client';

import {
  HARVEST_FLOW,
  HARVEST_FLOW_ROOT,
  LOT_SELECTION,
} from 'constants/routes';

import NumberFlow from '@number-flow/react';
import { ArrowLeftCircle, ArrowRightCircle, Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Alert, Button, Card, CardContent, CardHeader, CardTitle } from 'ui';
import { Format, MoneyUtil } from 'utilities';
import type { LotCurrentItemFragment } from 'generated/gql';
import {
  HarvestStep,
  HarvestType,
  LotValueType,
  useCreateHarvestMutation,
  useFinalizeHarvestMutation,
  useHarvestQuery,
  useLotsCurrentForLotTypeQuery,
  usePortfolioSummaryQuery,
  useUpdateHarvestMutation,
} from 'generated/gql';
import PageWrapper from 'modules/page/page-wrapper';
import { LoadingPage } from 'modules/utilityComponents';

import Complete from './steps/Complete';
import BuyBack from './steps/Configure';
import LotSelection from './steps/LotSelection';
import Finalize from './steps/Review';
import { headerMap } from './utils';

export type LotRowType = LotCurrentItemFragment & { selectedQuantity: number };

export type StepperStep = HarvestStep | 'LOT_SELECTION';

interface HarvestStepperProps {
  harvestType: HarvestType;
  // Missing ID means it has not been created and we should show the lot selection to create it.
  // The Stepper then creates the harvest and routes to a page with the id as a param
  harvestId?: string;
}

export default function HarvestStepper({
  harvestId,
  harvestType,
}: HarvestStepperProps) {
  const router = useRouter();

  const [harvestLots, setHarvestLots] = useState<LotRowType[]>([]);
  const [counterLots, setCounterLots] = useState<LotRowType[]>([]);

  const { data, loading } = usePortfolioSummaryQuery();
  const { data: dataHarvest, loading: loadingHarvest } = useHarvestQuery({
    skip: !harvestId,
    variables: {
      id: harvestId!,
    },
  });

  /**
   * Depending on the harvest type this is the amount we are actually looking to harvest
   */
  const harvestTarget =
    harvestType === HarvestType.ReduceTaxes
      ? data?.portfolioSummary.harvest.realized
      : data?.portfolioSummary.harvest.unrealized;

  const { error: errorLots, loading: loadingLots } =
    useLotsCurrentForLotTypeQuery({
      onCompleted: data => {
        setHarvestLots(
          data.lotCurrent.map(lot => ({
            ...lot,
            selectedQuantity: 0,
          }))
        );
      },
      skip: !harvestTarget,
      variables: {
        lotValueType:
          MoneyUtil.amountDirection(harvestTarget) === 'positive'
            ? LotValueType.Gain
            : LotValueType.Loss,
      },
    });

  const { error: errorCounterLots, loading: loadingCounterLots } =
    useLotsCurrentForLotTypeQuery({
      onCompleted: data => {
        setCounterLots(
          data.lotCurrent.map(lot => ({
            ...lot,
            selectedQuantity: 0,
          }))
        );
      },
      skip: !harvestTarget || HarvestType.ReduceCostBasis !== harvestType,
      variables: {
        lotValueType:
          MoneyUtil.amountDirection(harvestTarget) === 'positive'
            ? LotValueType.Loss
            : LotValueType.Gain,
      },
    });

  const [createHarvest, { loading: creatingHarvest }] =
    useCreateHarvestMutation();
  const [updateHarvest, { loading: updatingHarvest }] =
    useUpdateHarvestMutation();
  const [finalizeHarvest, { loading: finalizingHarvest }] =
    useFinalizeHarvestMutation();

  const step: StepperStep = dataHarvest?.harvest.step || 'LOT_SELECTION';

  const selectedHarvest: number = useMemo(
    () =>
      harvestLots.reduce((acc, curr) => {
        return (acc =
          acc +
          Math.abs(Number(curr.dollarPerSharePnL) * curr.selectedQuantity));
      }, 0),
    [harvestLots]
  );

  const selectedCounter: number = useMemo(
    () =>
      counterLots.reduce((acc, curr) => {
        return (acc =
          acc +
          Math.abs(Number(curr.dollarPerSharePnL) * curr.selectedQuantity));
      }, 0),
    [counterLots]
  );

  const handleNext = () => {
    if (step === 'LOT_SELECTION') {
      createHarvest({
        onCompleted: data => {
          router.push(
            HARVEST_FLOW({ harvestId: data.createHarvest.id, harvestType })
          );
        },
        variables: {
          directedHarvestLots: [
            ...harvestLots
              .filter(lot => lot.selectedQuantity)
              .map(lot => ({
                counterTransaction: false,
                lotId: lot.id,
                quantity: lot.selectedQuantity,
              })),
            ...(HarvestType.ReduceCostBasis === harvestType
              ? counterLots
                  .filter(lot => lot.selectedQuantity)
                  .map(lot => ({
                    counterTransaction: true,
                    lotId: lot.id,
                    quantity: lot.selectedQuantity,
                  }))
              : []),
          ],
          harvestType,
        },
      });
    } else if (step === HarvestStep.Configure) {
      finalizeHarvest({
        variables: {
          id: harvestId!,
        },
      });
    } else if (step === HarvestStep.Review) {
      updateHarvest({
        variables: {
          data: {
            step: {
              set: HarvestStep.Complete,
            },
          },
          id: harvestId!,
        },
      });
    }
  };

  const handlePrev = () => {
    if (step === 'LOT_SELECTION') {
      router.push(HARVEST_FLOW_ROOT);
    } else if (step === HarvestStep.Configure) {
      router.push(LOT_SELECTION({ harvestType }));
    } else if (step === HarvestStep.Review) {
      updateHarvest({
        variables: {
          data: {
            step: {
              set: HarvestStep.Configure,
            },
          },
          id: harvestId!,
        },
      });
    }
  };

  if (errorLots || errorCounterLots) {
    return <Alert>There was an error loading the lots.</Alert>;
  }

  if (loading || loadingHarvest || loadingLots || loadingCounterLots) {
    return <LoadingPage />;
  }

  const isChangingStep =
    creatingHarvest || updatingHarvest || finalizingHarvest;

  const recommendedHarvestAmounts =
    data?.portfolioSummary.harvestRecommendations?.find(
      rec => rec.harvestType === harvestType
    );

  return (
    <PageWrapper
      title={headerMap[step][harvestType].title}
      description={headerMap[step][harvestType].description}
      cornerElement={
        <Card className="mx-0 border-none p-0 shadow-none">
          <CardHeader className="text-primary flex flex-row items-center justify-between space-y-0 pb-2 pr-0 pt-0">
            <CardTitle className="flex space-x-4 text-sm font-medium">
              <span>Selected Harvest</span>
              <Wheat className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberFlow
                value={dataHarvest?.harvest.amount || selectedHarvest}
                format={{ currency: 'USD', style: 'currency' }}
              />
              {harvestType === HarvestType.Sell ? null : (
                <p className="text-muted-foreground inline text-sm font-bold">
                  /{' '}
                  {Format.money(
                    Math.abs(recommendedHarvestAmounts?.amountTotal || 0)
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      }
      next={
        <Button
          onClick={handleNext}
          disabled={
            (step === 'LOT_SELECTION' && !selectedHarvest) ||
            step === HarvestStep.Complete
          }
          iconRight={<ArrowRightCircle />}
          loading={isChangingStep}
        >
          {step === HarvestStep.Review ? 'Complete Harvest?' : 'Continue'}
        </Button>
      }
      prev={
        <Button
          onClick={handlePrev}
          variant="secondary"
          iconLeft={<ArrowLeftCircle />}
          disabled={
            updatingHarvest || creatingHarvest || step === HarvestStep.Complete
          }
          loading={isChangingStep}
        >
          Previous
        </Button>
      }
    >
      {!harvestId ? (
        <LotSelection
          harvestLots={harvestLots}
          counterLots={counterLots}
          setHarvestLots={setHarvestLots}
          setCounterLots={setCounterLots}
          harvestType={harvestType}
          selectedHarvest={selectedHarvest}
          selectedCounter={selectedCounter}
          targetRealized={recommendedHarvestAmounts?.amountRealized || 0}
          targetTotal={recommendedHarvestAmounts?.amountTotal || 0}
          targetUnrealized={recommendedHarvestAmounts?.amountUnrealized || 0}
        />
      ) : step === HarvestStep.Configure ? (
        <BuyBack harvestId={harvestId} />
      ) : step === HarvestStep.Review ? (
        <Finalize harvestId={harvestId} />
      ) : step === HarvestStep.Complete ? (
        <Complete harvestId={harvestId} />
      ) : null}
    </PageWrapper>
  );
}
