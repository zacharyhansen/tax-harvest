'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { HarvestPairingCard } from '~/modules/harvest/harvest-pairing-card';
import {
  useDeleteHarvestsMutation,
  useUpdateHarvestMutation,
  type HarvestSingleItemFragment,
} from '~/generated/gql';
import { Badge } from '@repo/ui/components/badge';
import { capitalCase } from 'change-case';
import { Avatar, AvatarImage } from '@repo/ui/components/avatar';
import { AvatarFallback } from '@repo/ui/components/avatar';
import { stringToTailwindColor } from '@repo/ui/utils';
import { Switch } from '@repo/ui/components/switch';
import { formatDate } from '~/modules/utils';
import { toast } from '@repo/ui/components/toast-sonner';
import { Button } from '@repo/ui/components/button';
import { useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/components/reponsive-dialog';
import { Clock, Check, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';

export function HarvestCard({
  harvest,
}: {
  harvest: HarvestSingleItemFragment;
}) {
  const [updateHarvest] = useUpdateHarvestMutation();
  const [deleteHarvest] = useDeleteHarvestsMutation();
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  const progressStep = 0; // TODO: Calculate progress step
  const remainingMs = 0; // TODO: Calculate remaining ms
  const markedSoldAt = harvest.date;
  const expiresAt = harvest.afterWashRevertDate;
  const repurchaseDate = harvest.afterWashRevertDate;
  const hasExpired = new Date(expiresAt) < new Date();
  const remainingTime = `${Math.ceil((new Date(repurchaseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`;

  const quantity = Number(
    harvest.harvestTransactions?.[0]?.harvestTransactionItem.quantity ?? 0
  );
  const lotPurchasePrice = Number(
    harvest.harvestTransactions?.[0]?.harvestTransactionItem.lotPricePaid ?? 0
  );
  const formattedPurchaseDate = formatDate(
    harvest.harvestTransactions?.[0]?.harvestTransactionItem.lotAcquiredDate
  );
  const taxSavings = Number(harvest.amount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDelete = () => {
    toast.promise(
      deleteHarvest({
        variables: {
          ids: [harvest.id],
        },
      }),
      {
        loading: 'Deleting harvest...',
        success: 'Harvest deleted',
        error: 'Failed to delete harvest',
      }
    );
  };

  return (
    <>
      <Card className="bg-background overflow-hidden border">
        <CardContent className="p-6">
          {/* Card Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Harvest for{' '}
                {
                  harvest.harvestTransactions?.[0]?.harvestTransactionItem
                    .assetSymbol
                }
              </h3>
              <div className="mt-1 flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-0 text-red-500 hover:text-red-400"
                    >
                      Delete Harvest
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Harvest</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this harvest? This will
                        restore the opportunity to the Tax Opportunities page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <ResponsiveDialog
                  open={showNotificationDialog}
                  onOpenChange={setShowNotificationDialog}
                >
                  <ResponsiveDialogTrigger asChild>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto px-0 text-yellow-500 hover:text-yellow-400"
                    >
                      Edit Reminder
                    </Button>
                  </ResponsiveDialogTrigger>
                  <ResponsiveDialogContent>
                    <ResponsiveDialogHeader>
                      <ResponsiveDialogTitle>
                        Notification Settings
                      </ResponsiveDialogTitle>
                      <ResponsiveDialogDescription>
                        Configure notification settings for this harvest
                      </ResponsiveDialogDescription>
                    </ResponsiveDialogHeader>
                    <ResponsiveDialogBody>
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h4 className="font-medium">
                            Wash Sale Notification
                          </h4>
                          <p className="text-sm text-gray-500">
                            Get notified when the wash sale period ends on{' '}
                            {formatDate(harvest.afterWashRevertDate)}
                          </p>
                        </div>
                        <Switch
                          defaultChecked={harvest.notify}
                          onCheckedChange={value => {
                            toast.promise(
                              updateHarvest({
                                variables: {
                                  id: harvest.id,
                                  data: {
                                    notify: {
                                      set: value,
                                    },
                                  },
                                },
                              }),
                              {
                                loading: 'Updating notification settings...',
                                success: 'Notification settings updated',
                                error: 'Failed to update notification settings',
                              }
                            );
                          }}
                        />
                      </div>
                    </ResponsiveDialogBody>
                    <ResponsiveDialogFooter>
                      <ResponsiveDialogClose asChild>
                        <Button variant="secondary">Close</Button>
                      </ResponsiveDialogClose>
                    </ResponsiveDialogFooter>
                  </ResponsiveDialogContent>
                </ResponsiveDialog>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium text-green-500">
                {formatCurrency(Math.abs(taxSavings))}
              </span>
              <div className="text-muted-foreground text-sm">Tax Savings</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative my-6 flex items-center">
            {/* Timeline bar */}
            <div className="bg-background/10 absolute h-0.5 w-full">
              <div
                className="absolute h-0.5 bg-yellow-500 transition-all duration-300"
                style={{
                  width: `${progressStep >= 1 ? 100 : remainingMs <= 0 ? 100 : ((24 * 60 * 60 * 1000 - remainingMs) / (24 * 60 * 60 * 1000)) * 100}%`,
                }}
              />
            </div>

            {/* Step 1: Harvest Marked */}
            <div className="relative z-10">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${progressStep >= 0 ? 'bg-yellow-500' : 'bg-gray-500'}`}
              >
                <Clock className="text-background h-3 w-3" />
              </div>
            </div>

            {/* Line to Step 2 */}
            <div className="flex-1"></div>

            {/* Step 2: Recommendation Expires */}
            <div className="relative z-10">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${progressStep >= 1 ? 'bg-yellow-500' : 'bg-gray-500'}`}
              >
                {progressStep >= 1 ? (
                  <Check className="text-background h-3 w-3" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                )}
              </div>
            </div>

            {/* Line to Step 3 */}
            <div className="flex-1"></div>

            {/* Step 3: RePurchase Reminder */}
            <div className="relative z-10">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${progressStep >= 2 ? 'bg-yellow-500' : 'bg-gray-500'}`}
              >
                {progressStep >= 2 ? (
                  <Check className="text-background h-3 w-3" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Labels */}
          <div className="mb-8 grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="font-medium">Harvest Marked</div>
              <div className="text-muted-foreground">
                {formatDate(new Date(markedSoldAt))}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">
                Recommendation {hasExpired ? 'Expired' : 'Expires'}
              </div>
              <div
                className={`${hasExpired ? 'text-muted-foreground' : 'text-yellow-500'} font-medium`}
              >
                {hasExpired ? formatDate(new Date(expiresAt)) : remainingTime}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">RePurchase Reminder</div>
              <div className="text-muted-foreground">
                {formatDate(repurchaseDate)}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="mb-1 font-medium">Number of Shares</div>
              <div className="text-muted-foreground font-medium">
                {Math.floor(quantity)}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-1 font-medium">Lot Purchase Date</div>
              <div className="text-muted-foreground font-medium">
                {formattedPurchaseDate}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 font-medium">Lot Purchase Price</div>
              <div className="text-muted-foreground font-medium">
                {formatCurrency(lotPurchasePrice)}
              </div>
            </div>
          </div>

          {/* Delete Button Section */}
          <div className="mt-6 border-t border-gray-800 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-red-500 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Harvest
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Harvest</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this harvest? This will
                    restore the opportunity to the Tax Opportunities page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted overflow-hidden border-0 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <Badge>{capitalCase(harvest.type)}</Badge>
              <div>{harvest.label}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  defaultChecked={harvest.notify}
                  onCheckedChange={value => {
                    toast.promise(
                      updateHarvest({
                        variables: {
                          id: harvest.id,
                          data: {
                            notify: {
                              set: value,
                            },
                          },
                        },
                      }),
                      {
                        loading: 'Updating harvest...',
                        success: 'Harvest updated',
                        error: 'Failed to update harvest',
                      }
                    );
                  }}
                />
                <div className="text-sm">
                  {formatDate(harvest.afterWashRevertDate)} Wash Notification?
                </div>
              </div>
              <Avatar>
                <AvatarImage src={harvest.createdBy.photo ?? ''} />
                <AvatarFallback
                  className={stringToTailwindColor(
                    harvest.createdBy.name ?? harvest.createdBy.email ?? ''
                  )}
                >
                  {harvest.createdBy.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardTitle>
        </CardHeader>
        <HarvestPairingCard
          harvestItem={{
            sourceLots:
              harvest.harvestTransactions
                ?.filter(transaction => !transaction.counterTransaction)
                ?.map(transaction => ({
                  id: transaction.id,
                  assetSymbol: transaction.harvestTransactionItem.assetSymbol,
                  pAndL:
                    Number(transaction.harvestTransactionItem.quantity) *
                    (Number(
                      transaction.harvestTransactionItem.lotPriceAtHarvest
                    ) -
                      Number(transaction.harvestTransactionItem.lotPricePaid)),
                  remainingQty: Number(
                    transaction.harvestTransactionItem.quantity
                  ),
                  quantity: Number(transaction.harvestTransactionItem.quantity),
                  acquiredDate:
                    transaction.harvestTransactionItem.lotAcquiredDate,
                  pricePaid: Number(
                    transaction.harvestTransactionItem.lotPricePaid
                  ),
                  lastPrice: Number(
                    transaction.harvestTransactionItem.lotPriceAtHarvest
                  ),
                })) ?? [],
            matchedLotOrders:
              harvest.harvestTransactions
                ?.filter(transaction => transaction.counterTransaction)
                .map(transaction => ({
                  id: transaction.id,
                  assetSymbol: transaction.harvestTransactionItem.assetSymbol,
                  pAndL:
                    Number(transaction.harvestTransactionItem.quantity) *
                    (Number(
                      transaction.harvestTransactionItem.lotPriceAtHarvest
                    ) -
                      Number(transaction.harvestTransactionItem.lotPricePaid)),
                  remainingQty: Number(
                    transaction.harvestTransactionItem.quantity
                  ),
                  quantity: Number(transaction.harvestTransactionItem.quantity),
                  acquiredDate:
                    transaction.harvestTransactionItem.lotAcquiredDate,
                  pricePaid: Number(
                    transaction.harvestTransactionItem.lotPricePaid
                  ),
                  lastPrice: Number(
                    transaction.harvestTransactionItem.lotPriceAtHarvest
                  ),
                })) ?? [],
          }}
        />
      </Card>{' '}
    </>
  );
}
