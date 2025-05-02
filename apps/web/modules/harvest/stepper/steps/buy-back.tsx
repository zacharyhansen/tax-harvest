import { capitalCase } from 'change-case';
import { CalendarIcon, Info } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Switch } from '@repo/ui/components/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover';
import { cn } from '@repo/ui/utils';

import { Format, formatDate } from '~/modules/utils';
import type { HarvestTransactionRecordFragment } from '~/generated/gql';
import {
  HarvestType,
  useHarvestQuery,
  useUpdateHarvestMutation,
  useUpdateHarvestTransactionMutation,
} from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';

interface ConfigureProps {
  harvestId: string;
}

export default function BuyBack({ harvestId }: ConfigureProps) {
  const [label, setLabel] = useState<string>('');
  const { data, loading } = useHarvestQuery({
    onCompleted: data => {
      setLabel(data.harvest.label);
    },
    variables: {
      id: harvestId,
    },
  });

  const [mutate] = useUpdateHarvestMutation();

  if (loading || !data) {
    return <LoadingPage />;
  }

  if (data.harvest.type === HarvestType.ReduceCostBasis) {
    return (
      <div className="flex-grow space-y-4 overflow-auto pb-10">
        <Tabs defaultValue="loss" className="flex h-full flex-col">
          <TabsList>
            <TabsTrigger value="loss">Loss Transactions</TabsTrigger>
            <TabsTrigger value="gain">Gain Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="loss" className="flex-grow overflow-auto">
            {data.harvest.harvestTransactions
              ?.filter(t => !t.counterTransaction)
              .map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
          </TabsContent>
          <TabsContent value="gain" className="flex-grow overflow-auto">
            {data.harvest.harvestTransactions
              ?.filter(t => t.counterTransaction)
              .map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex-grow space-y-4 overflow-auto pb-10">
      <Label>Harvest Name</Label>
      <Input
        value={label}
        onChange={e => {
          setLabel(e.target.value);
        }}
        onBlur={e => {
          void mutate({
            variables: {
              data: {
                label: {
                  set: e.target.value,
                },
              },
              id: data.harvest.id,
            },
          });
          e.target.value;
        }}
      />
      {data.harvest.harvestTransactions?.map(transaction => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}

function TransactionCard({
  transaction,
}: {
  transaction: HarvestTransactionRecordFragment;
}) {
  const [updateTransaction] = useUpdateHarvestTransactionMutation();

  return (
    <Card key={transaction.id}>
      <CardHeader className="py-3">
        <CardTitle className="flex flex-row items-center">
          <div>
            {transaction.replacementTransactionItem ? (
              <div className="flex items-center justify-center">
                <span>{`${capitalCase(
                  transaction.replacementTransactionItem.orderType
                )} ${transaction.replacementTransactionItem.asset.symbol} for ${transaction.harvestTransactionItem.asset.symbol}`}</span>
              </div>
            ) : (
              transaction.harvestTransactionItem.asset.symbol
            )}
          </div>
          <Badge className="ml-4">
            {/* {Format.money(
              Number(transaction.harvestTransactionItem.asset.lastPrice) *
                transaction.harvestTransactionItem.quantity
            )} */}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="p-2 px-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Action
                </p>
                <p className="text-md font-semibold text-red-600">
                  {capitalCase(transaction.harvestTransactionItem.orderType)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Security
                </p>
                <p className="text-md font-semibold">
                  {transaction.harvestTransactionItem.asset.symbol}{' '}
                  {formatDate(
                    transaction.harvestTransactionItem.lotSold?.acquiredDate
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Quantity
                </p>
                <p className="text-md">
                  {transaction.harvestTransactionItem.quantity}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Price
                </p>
                <p className="text-md">
                  {Format.money(
                    transaction.harvestTransactionItem.asset.lastPrice
                  )}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Change
                </p>
                <p className="text-md">
                  {/* {Format.money(
                    Number(transaction.harvestTransactionItem.asset.lastPrice) *
                      transaction.harvestTransactionItem.quantity
                  )} */}
                </p>
              </div>
            </div>
          </div>
          {transaction.replacementTransactionItem ? (
            <div className="p-2 px-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Action
                  </p>
                  <p className="text-md font-semibold text-green-600 dark:text-green-400">
                    {capitalCase(
                      transaction.replacementTransactionItem.orderType
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Security
                  </p>
                  <p className="text-md font-semibold">
                    {transaction.replacementTransactionItem.asset.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Quantity
                  </p>
                  <p className="text-md">
                    {transaction.replacementTransactionItem.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Price
                  </p>
                  <p className="text-md">
                    {Format.money(
                      transaction.replacementTransactionItem.asset.lastPrice
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Change
                  </p>
                  <p className="text-md">
                    {/* {Format.money(
                      Number(
                        transaction.replacementTransactionItem.asset.lastPrice
                      ) * transaction.replacementTransactionItem.quantity
                    )} */}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end space-x-2 py-1">
        <div className="ml-auto flex flex-row items-center space-x-2 rounded-lg border p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Info className="inline h-4 w-4" />{' '}
                  <span className="text-sm font-normal">
                    Do you want to repurchase these positions?
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 font-light">
                  After the wash window you can re-enter the same positions with
                  a new tax basis. To avoid a wash sale, the transaction should
                  not be reversed for a minimum of 30 calender days.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Switch
            checked={transaction.revert}
            onCheckedChange={() => {
              void updateTransaction({
                variables: {
                  data: {
                    revert: {
                      set: !transaction.revert,
                    },
                  },
                  id: transaction.id,
                },
              });
            }}
            aria-label="Toggle buyback reminder"
          />
        </div>
        <div className="ml-auto flex flex-row items-center space-x-2 rounded-lg border p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4" />{' '}
                  <span className="text-sm font-normal">
                    Notify me on repurchase date?
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 font-light">
                  We will notify you on the date selected to perform the
                  repurchse according to your notification preferences.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Switch
            checked={transaction.notify}
            onCheckedChange={() => {
              void updateTransaction({
                variables: {
                  data: {
                    notify: {
                      set: !transaction.notify,
                    },
                  },
                  id: transaction.id,
                },
              });
            }}
            aria-label="Toggle buyback reminder"
          />
        </div>
        <Popover>
          <PopoverTrigger
            asChild
            disabled={!(transaction.revert || transaction.notify)}
          >
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !(transaction.revert || transaction.notify) &&
                  'text-muted-foreground'
              )}
            >
              {/* {transaction.revertDate ? (
                DateFormatter.format(transaction.revertDate, 'PPP')
              ) : (
                <span>Pick a date</span>
              )} */}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={transaction.revertDate}
              onSelect={value => {
                void updateTransaction({
                  variables: {
                    data: {
                      revertDate: {
                        set: value ?? Date.now(),
                      },
                    },
                    id: transaction.id,
                  },
                });
              }}
              disabled={date => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}
