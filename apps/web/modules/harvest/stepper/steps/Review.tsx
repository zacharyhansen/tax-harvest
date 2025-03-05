'use client';

import { capitalCase } from 'change-case';
import { Check, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui';
import { Format, formatDate } from 'utilities';
import { useHarvestQuery } from 'generated/gql';
import { LoadingPage } from 'modules/utilityComponents';

interface ReviewProps {
  harvestId: string;
}

export default function Review({ harvestId }: ReviewProps) {
  const { data, loading } = useHarvestQuery({
    onCompleted: data => {
      setExpandedTransactions(
        data.harvest.harvestTransactions?.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: true,
          }),
          {}
        ) || {}
      );
    },
    variables: {
      id: harvestId,
    },
  });

  const [expandedTransactions, setExpandedTransactions] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedTransactions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="transaction-timeline relative space-y-4 pb-10">
      <div
        className="bg-muted absolute bottom-0 left-[15px] top-0 z-0 w-[2px]"
        aria-hidden="true"
      ></div>
      <div className="bg-secondary relative ml-12 rounded-md border py-2 text-center text-xl font-semibold">
        {data?.harvest.label}
      </div>
      {data?.harvest.harvestTransactions?.map((transaction, index) => (
        <div key={transaction.id} className="relative pl-12">
          <div className="bg-muted transaction-number absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full font-bold">
            {index + 1}
          </div>
          <Card className="overflow-hidden">
            <CardHeader
              className="bg-muted cursor-pointer py-3"
              onClick={() => toggleExpand(transaction.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <div>
                  {transaction.replacementTransactionItem ? (
                    <div className="flex items-center justify-center">
                      <span>{`${capitalCase(
                        transaction.replacementTransactionItem?.orderType || ''
                      )} ${transaction.replacementTransactionItem.asset.symbol} for ${transaction.harvestTransactionItem.asset.symbol}`}</span>
                      <Badge className="ml-4">
                        {Format.money(
                          Number(
                            transaction.harvestTransactionItem.asset.lastPrice
                          ) * transaction.harvestTransactionItem.quantity
                        )}
                      </Badge>
                    </div>
                  ) : (
                    `${capitalCase(transaction.harvestTransactionItem?.orderType)} ${transaction.harvestTransactionItem.asset.symbol}`
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  {expandedTransactions[transaction.id] ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              {!expandedTransactions[transaction.id] && (
                <div className="text-muted-foreground text-sm">
                  {transaction.revert && transaction.notify
                    ? `Revert and notify on ${formatDate(transaction.revertDate)}`
                    : transaction.revert
                      ? `Revert on ${formatDate(transaction.revertDate)}`
                      : transaction.notify
                        ? `Notify on ${formatDate(transaction.revertDate)}`
                        : null}
                </div>
              )}
            </CardHeader>
            {expandedTransactions[transaction.id] && (
              <>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Security</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="secondary">
                            {capitalCase(
                              transaction.harvestTransactionItem.orderType || ''
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.harvestTransactionItem.asset.symbol}
                        </TableCell>
                        <TableCell>
                          {Format.money(
                            transaction.harvestTransactionItem.asset.lastPrice
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.harvestTransactionItem.quantity}
                        </TableCell>
                        <TableCell>
                          {Format.money(
                            Number(
                              transaction.harvestTransactionItem.asset.lastPrice
                            ) * transaction.harvestTransactionItem.quantity
                          )}
                        </TableCell>
                      </TableRow>
                      {transaction.replacementTransactionItem ? (
                        <TableRow>
                          <TableCell className="font-medium">
                            <Badge variant="secondary">
                              {capitalCase(
                                transaction.replacementTransactionItem
                                  ?.orderType || ''
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {
                              transaction.replacementTransactionItem?.asset
                                .symbol
                            }
                          </TableCell>
                          <TableCell>
                            {Format.money(
                              transaction.replacementTransactionItem?.asset
                                .lastPrice
                            )}
                          </TableCell>
                          <TableCell>
                            {transaction.replacementTransactionItem?.quantity}
                          </TableCell>
                          <TableCell>
                            {Format.money(
                              Number(
                                transaction.replacementTransactionItem?.asset
                                  .lastPrice
                              ) *
                                transaction.replacementTransactionItem?.quantity
                            )}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </CardContent>
                {transaction.revertHarvestTransactionItem ? (
                  <>
                    <CardHeader className="bg-muted rounded-t-xl py-4">
                      <CardTitle>
                        <div className="flex items-center space-x-2">
                          <div>Repurchase Transactions</div>
                          {transaction.notify ? (
                            <Badge>
                              Notify <Check className="ml-2 h-3 w-3" />
                            </Badge>
                          ) : null}
                          <Badge>{formatDate(transaction.revertDate)}</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="h-0">
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Security</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              <Badge variant="secondary">
                                {capitalCase(
                                  transaction.revertHarvestTransactionItem
                                    ?.orderType || ''
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {
                                transaction.revertHarvestTransactionItem?.asset
                                  .symbol
                              }
                            </TableCell>
                            <TableCell>
                              {Format.money(
                                transaction.revertHarvestTransactionItem?.asset
                                  .lastPrice
                              )}
                            </TableCell>
                            <TableCell>
                              {
                                transaction.revertHarvestTransactionItem
                                  ?.quantity
                              }
                            </TableCell>
                            <TableCell>
                              {Format.money(
                                Number(
                                  transaction.revertHarvestTransactionItem
                                    ?.asset.lastPrice
                                ) *
                                  transaction.revertHarvestTransactionItem
                                    ?.quantity
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              <Badge variant="secondary">
                                {capitalCase(
                                  transaction.revertReplacementTransactionItem
                                    ?.orderType || ''
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {
                                transaction.revertReplacementTransactionItem
                                  ?.asset.symbol
                              }
                            </TableCell>
                            <TableCell>
                              {Format.money(
                                transaction.revertReplacementTransactionItem
                                  ?.asset.lastPrice
                              )}
                            </TableCell>
                            <TableCell>
                              {
                                transaction.revertReplacementTransactionItem
                                  ?.quantity
                              }
                            </TableCell>
                            <TableCell>
                              {Format.money(
                                Number(
                                  transaction.revertReplacementTransactionItem
                                    ?.asset.lastPrice
                                ) *
                                  transaction.revertReplacementTransactionItem
                                    ?.quantity
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </>
                ) : null}
              </>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}
