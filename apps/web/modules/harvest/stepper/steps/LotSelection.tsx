import NumberFlow from '@number-flow/react';
import type { RowSelectionState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Button, DataTable } from 'ui';
import { Format } from 'utilities';
import { HarvestType, useDirectedHarvestLazyQuery } from 'generated/gql';

import type { LotRowType } from '../HarvestStepper';

import columns from './RealizedDirectedHarvest.ColumnDef';

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
  const [directedHarvest, {}] = useDirectedHarvestLazyQuery();

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
    <div className="flex flex-col space-y-8 pb-20">
      <DataTable
        key="main"
        header={
          <div>
            <div className="text-lg">
              {tableLabel[harvestType]}{' '}
              <Button
                variant="link"
                onClick={() => {
                  directedHarvest({
                    onCompleted: data => {
                      setHarvestLots(
                        harvestLots.map(lot => {
                          const selectedQuantity = Number(
                            data.directedHarvest.allOrders.find(
                              order => order.lotId === lot.id
                            )?.quantity || 0
                          );
                          return {
                            ...lot,
                            selectedQuantity,
                          };
                        })
                      );
                    },
                    variables: {
                      lots:
                        harvestLots.map(lot => ({
                          lotId: lot.id,
                          quantity: Number(lot.remainingQty),
                        })) || [],
                      targetRealized,
                      targetUnrealized,
                    },
                  });
                }}
              >
                Select for me
              </Button>
            </div>
          </div>
        }
        columns={columns}
        onUpdateCell={(rowIndex, columnId, value) => {
          const newLots = harvestLots.slice();
          newLots[rowIndex].selectedQuantity = value as number;
          setHarvestLots(newLots);
        }}
        data={harvestLots}
        noResultsAlert={
          'There are no lots that match the harvesting parameters.'
        }
        enableRowSelection={true}
        rowSelectionState={rowSelectionState}
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
        <DataTable
          key="counter"
          header={
            <div className="flex">
              <div className="text-lg">
                Select Gain Postions{' '}
                <Button
                  variant="link"
                  onClick={() => {
                    directedHarvest({
                      onCompleted: data => {
                        setCounterLots(
                          counterLots.map(lot => {
                            const selectedQuantity = Number(
                              data.directedHarvest.allOrders.find(
                                order => order.lotId === lot.id
                              )?.quantity || 0
                            );
                            return {
                              ...lot,
                              selectedQuantity,
                            };
                          })
                        );
                      },
                      variables: {
                        lots:
                          counterLots.map(lot => ({
                            lotId: lot.id,
                            quantity: Number(lot.remainingQty),
                          })) || [],
                        targetRealized: selectedHarvest,
                        targetUnrealized: 0,
                      },
                    });
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
            newLots[rowIndex].selectedQuantity = value as number;
            setCounterLots(newLots);
          }}
          data={counterLots}
          noResultsAlert={
            'There are no lots that match the harvesting parameters.'
          }
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
                newLot.selectedQuantity = Number(isNewLotSelected.remainingQty);
                // Else we set it to 0 if its been desected
              } else if (!isNewLotSelected) {
                newLot.selectedQuantity = 0;
              }
            });
            setCounterLots(newlots);
          }}
        />
      ) : null}
    </div>
  );
}
