import NumberFlow from '@number-flow/react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Button } from '@repo/ui/components/button';
import DataTable from '@repo/ui/components/dataTable/dataTable';
import { Separator } from '@repo/ui/components/separator';
import { toast } from '@repo/ui/components/toast-sonner';

import type { LotRowType } from '../HarvestStepper';

import columns from './RealizedDirectedHarvest.ColumnDef';

import { Format } from '~/modules/utils';
import { HarvestType, useDirectedHarvestLazyQuery } from '~/generated/gql';

const tableLabel: Record<HarvestType, string> = {
  [HarvestType.ReduceTaxes]: 'Select Positions',
  [HarvestType.ReduceCostBasis]: 'Select Loss Positions',
  [HarvestType.Sell]: 'Select Sale Positions',
  [HarvestType.CaptureGainsTaxFree]: 'Select Gains',
};

interface LotSelectionProps {
  harvestLots: LotRowType[];
  counterLots: LotRowType[];
  setHarvestLots: (lots: LotRowType[]) => void;
  setCounterLots: (lots: LotRowType[]) => void;
  harvestType: HarvestType;
  targetRealized: number;
  targetUnrealized: number;
  targetTotal: number;
  selectedHarvest: number;
  selectedCounter: number;
}

export default function LotSelection({
  counterLots,
  harvestLots,
  harvestType,
  selectedCounter,
  selectedHarvest,
  setCounterLots,
  setHarvestLots,
  targetRealized,
  targetUnrealized,
}: LotSelectionProps) {
  const [directedHarvest] = useDirectedHarvestLazyQuery();

  const rowSelectionState: RowSelectionState = useMemo(() => {
    return harvestLots.reduce((acc, curr, i) => {
      return { ...acc, [i]: !!curr.selectedQuantity };
    }, {});
  }, [harvestLots]);

  const rowCounterSelectionState: RowSelectionState = useMemo(() => {
    return counterLots.reduce((acc, curr, i) => {
      return { ...acc, [i]: !!curr.selectedQuantity };
    }, {});
  }, [counterLots]);

  return (
    <>
      <DataTable
        className={
          harvestType === HarvestType.ReduceCostBasis ? 'h-1/2' : undefined
        }
        key="main"
        header={
          <div>
            <div className="text-lg">
              {tableLabel[harvestType]}{' '}
              {harvestType !== HarvestType.Sell ? (
                <Button
                  variant="link"
                  onClick={() => {
                    toast.promise(
                      directedHarvest({
                        onCompleted: data => {
                          setHarvestLots(
                            harvestLots.map(lot => {
                              const selectedQuantity = Number(
                                data.directedHarvest.allOrders.find(
                                  order => order.lotId === lot.id
                                )?.quantity ?? 0
                              );
                              return {
                                ...lot,
                                selectedQuantity,
                              };
                            })
                          );
                        },
                        variables: {
                          lots: harvestLots.map(lot => ({
                            lotId: lot.id,
                            quantity: Number(lot.remainingQty),
                          })),
                          targetRealized,
                          targetUnrealized,
                        },
                      }),
                      {
                        loading: 'Selecting positions...',
                        success: 'Positions selected',
                        error: 'Error selecting positions',
                      }
                    );
                  }}
                >
                  Select for me
                </Button>
              ) : null}
            </div>
          </div>
        }
        columns={columns}
        onUpdateCell={(rowIndex, columnId, value) => {
          const newLots = harvestLots.slice();
          newLots[rowIndex]!.selectedQuantity = value as number;
          setHarvestLots(newLots);
        }}
        data={harvestLots}
        noResultsAlert={
          'There are no lots that match the harvesting parameters.'
        }
        enableRowSelection={true}
        rowSelectionState={rowSelectionState}
        initialState={{
          sorting: [{ id: 'gainTotal', desc: true }],
        }}
        onRowSelectionChange={({ selectedRows }) => {
          const newlots = harvestLots.map(lot => ({ ...lot }));
          // Loop over all lots
          newlots.forEach(newLot => {
            const isNewLotSelected = selectedRows.find(
              lot => lot.id === newLot.id
            );

            // If the lot has been selected (its value is still 0) set it to the remainingQty
            if (isNewLotSelected && !newLot.selectedQuantity) {
              newLot.selectedQuantity = Number(isNewLotSelected.remainingQty);
              // Else we set it to 0 if its been desected
            } else if (!isNewLotSelected) {
              newLot.selectedQuantity = 0;
            }
          });
          setHarvestLots(newlots);
        }}
      />
      {harvestType === HarvestType.ReduceCostBasis ? (
        <>
          <Separator className="my-2" />
          <DataTable
            key="counter"
            header={
              <div className="flex">
                <div className="text-lg">
                  Select Gain Postions{' '}
                  <Button
                    variant="link"
                    onClick={() => {
                      toast.promise(
                        directedHarvest({
                          onCompleted: data => {
                            setCounterLots(
                              counterLots.map(lot => {
                                const selectedQuantity = Number(
                                  data.directedHarvest.allOrders.find(
                                    order => order.lotId === lot.id
                                  )?.quantity ?? 0
                                );
                                return {
                                  ...lot,
                                  selectedQuantity,
                                };
                              })
                            );
                          },
                          variables: {
                            lots: counterLots.map(lot => ({
                              lotId: lot.id,
                              quantity: Number(lot.remainingQty),
                            })),
                            targetRealized: selectedHarvest,
                            targetUnrealized: 0,
                          },
                        }),
                        {
                          loading: 'Selecting gain positions...',
                          success: 'Gain positions selected',
                          error: 'Error selecting gain positions',
                        }
                      );
                    }}
                  >
                    Select for me
                  </Button>
                </div>
                <div className="ml-auto text-2xl font-bold">
                  <NumberFlow
                    value={selectedCounter}
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                  <p className="text-muted-foreground inline text-sm font-bold">
                    / {Format.money(Math.abs(selectedHarvest))}
                  </p>
                </div>
              </div>
            }
            columns={columns}
            onUpdateCell={(rowIndex, columnId, value) => {
              const newLots = counterLots.slice();
              newLots[rowIndex]!.selectedQuantity = value as number;
              setCounterLots(newLots);
            }}
            data={counterLots}
            noResultsAlert={
              'There are no lots that match the harvesting parameters.'
            }
            initialState={{
              sorting: [{ id: 'gainTotal', desc: true }],
            }}
            enableRowSelection={true}
            rowSelectionState={rowCounterSelectionState}
            onRowSelectionChange={({ selectedRows }) => {
              const newlots = counterLots.map(lot => ({ ...lot }));
              // Loop over all lots
              newlots.forEach(newLot => {
                const isNewLotSelected = selectedRows.find(
                  lot => lot.id === newLot.id
                );

                // If the lot has been selected (its value is still 0) set it to the remainingQty
                if (isNewLotSelected && !newLot.selectedQuantity) {
                  newLot.selectedQuantity = Number(
                    isNewLotSelected.remainingQty
                  );
                  // Else we set it to 0 if its been desected
                } else if (!isNewLotSelected) {
                  newLot.selectedQuantity = 0;
                }
              });
              setCounterLots(newlots);
            }}
            className="h-1/2"
          />
        </>
      ) : null}
      {/* We start allowing more selling of winners once we reach tax amount of
      losses */}
      {harvestType === HarvestType.Sell && selectedHarvest > 3000 ? (
        <>
          <Separator className="my-2" />
          <DataTable
            key="counter"
            header={
              <div className="flex">
                <div className="flex flex-col text-lg">
                  <div className="flex items-center gap-2">
                    Select Gain Postions to Sell{' '}
                    <Button
                      variant="link"
                      onClick={() => {
                        toast.promise(
                          directedHarvest({
                            onCompleted: data => {
                              setCounterLots(
                                counterLots.map(lot => {
                                  const selectedQuantity = Number(
                                    data.directedHarvest.allOrders.find(
                                      order => order.lotId === lot.id
                                    )?.quantity ?? 0
                                  );
                                  return {
                                    ...lot,
                                    selectedQuantity,
                                  };
                                })
                              );
                            },
                            variables: {
                              lots: counterLots.map(lot => ({
                                lotId: lot.id,
                                quantity: Number(lot.remainingQty),
                              })),
                              targetRealized: selectedHarvest - 3000,
                              targetUnrealized: 0,
                            },
                          }),
                          {
                            loading: 'Selecting gain positions...',
                            success: 'Gain positions selected',
                            error: 'Error selecting gain positions',
                          }
                        );
                      }}
                    >
                      Select for me
                    </Button>
                  </div>
                  <p className="text-muted-foreground inline text-sm font-bold">
                    You have reached the tax deductible amount of losses.
                  </p>
                </div>
                <div className="ml-auto text-2xl font-bold">
                  <NumberFlow
                    value={selectedCounter}
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                  <p className="text-muted-foreground inline text-sm font-bold">
                    / {Format.money(Math.abs(selectedHarvest) - 3000)}
                  </p>
                </div>
              </div>
            }
            columns={columns}
            onUpdateCell={(rowIndex, columnId, value) => {
              const newLots = counterLots.slice();
              newLots[rowIndex]!.selectedQuantity = value as number;
              setCounterLots(newLots);
            }}
            data={counterLots}
            noResultsAlert={
              'There are no lots that match the harvesting parameters.'
            }
            initialState={{
              sorting: [{ id: 'gainTotal', desc: true }],
            }}
            enableRowSelection={true}
            rowSelectionState={rowCounterSelectionState}
            onRowSelectionChange={({ selectedRows }) => {
              const newlots = counterLots.map(lot => ({ ...lot }));
              // Loop over all lots
              newlots.forEach(newLot => {
                const isNewLotSelected = selectedRows.find(
                  lot => lot.id === newLot.id
                );

                // If the lot has been selected (its value is still 0) set it to the remainingQty
                if (isNewLotSelected && !newLot.selectedQuantity) {
                  newLot.selectedQuantity = Number(
                    isNewLotSelected.remainingQty
                  );
                  // Else we set it to 0 if its been desected
                } else if (!isNewLotSelected) {
                  newLot.selectedQuantity = 0;
                }
              });
              setCounterLots(newlots);
            }}
            className="h-1/2"
          />
        </>
      ) : null}
    </>
  );
}
