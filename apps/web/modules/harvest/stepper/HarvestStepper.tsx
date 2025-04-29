'use client';

import NumberFlow from '@number-flow/react';
import { ArrowLeftCircle, ArrowRightCircle, Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Alert } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';

import Complete from './steps/Complete';
import BuyBack from './steps/buy-back';
import LotSelection from './steps/LotSelection';
import Finalize from './steps/Review';
import { headerMap } from './utils';

import {
  HarvestStep,
  HarvestType,
  type LotCurrentItemFragment,
  LotValueType,
  useCreateHarvestMutation,
  useFinalizeHarvestMutation,
  useHarvestQuery,
  useLotsCurrentForLotTypeQuery,
  usePortfolioSummaryQuery,
  useUpdateHarvestMutation,
} from '~/generated/gql';
import { Format, MoneyUtil } from '~/modules/utils';
import { PageWrapper } from '~/modules/layout';
import { LoadingPage } from '~/modules/utility-components';
import { TypedRoutes } from '~/lib/routes';

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
      skip: !harvestTarget,
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

  const step: StepperStep = dataHarvest?.harvest.step ?? 'LOT_SELECTION';

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
      void createHarvest({
        onCompleted: data => {
          router.push(
            TypedRoutes.harvestFlowType({
              harvestId: data.createHarvest.id,
              type: harvestType,
            })
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
      void finalizeHarvest({
        variables: {
          id: harvestId!,
        },
      });
    } else if (step === HarvestStep.Review) {
      void updateHarvest({
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
      TypedRoutes.harvestFlowRoot();
    } else if (step === HarvestStep.Configure) {
      TypedRoutes.harvestFlowType({
        harvestId: harvestId!,
        type: harvestType,
      });
    } else if (step === HarvestStep.Review) {
      void updateHarvest({
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

  if (errorLots ?? errorCounterLots) {
    return <Alert>There was an error loading the lots.</Alert>;
  }

  if (loading || loadingHarvest || loadingLots || loadingCounterLots) {
    return <LoadingPage />;
  }

  const isChangingStep =
    creatingHarvest || updatingHarvest || finalizingHarvest;

  const recommendedHarvestAmounts =
    data?.portfolioSummary.harvestRecommendations.find(
      rec => rec.harvestType === harvestType
    );

  return (
    <PageWrapper
      title={headerMap[step][harvestType].title}
      description={headerMap[step][harvestType].description}
      className="mx-auto"
      cornerElement={
        <Card className="mx-0 border-none p-0 shadow-none">
          <CardHeader className="text-primary flex flex-row items-center justify-between space-y-0 pb-2 pr-0 pt-0">
            <CardTitle className="flex space-x-4 text-sm font-medium">
              <span className="whitespace-nowrap">Selected Harvest</span>
              <Wheat className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-nowrap text-2xl font-bold">
              <NumberFlow
                value={dataHarvest?.harvest.amount || selectedHarvest}
                format={{ currency: 'USD', style: 'currency' }}
              />
              {harvestType === HarvestType.Sell ? null : (
                <p className="text-muted-foreground inline text-sm font-bold">
                  /{' '}
                  {Format.money(
                    Math.abs(recommendedHarvestAmounts?.amountTotal ?? 0)
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
          targetRealized={recommendedHarvestAmounts?.amountRealized ?? 0}
          targetTotal={recommendedHarvestAmounts?.amountTotal ?? 0}
          targetUnrealized={recommendedHarvestAmounts?.amountUnrealized ?? 0}
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
