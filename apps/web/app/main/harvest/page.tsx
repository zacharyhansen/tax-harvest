'use client';

import HarvestSummaryCards from 'modules/harvest/HarvestSummaryCards';
import PageWrapper from 'modules/page/page-wrapper';

// import columns from "./RealizedOrders.ColumnDef";

export default function Page() {
  // const { data, error, loading } = useHarvestEvalQuery();

  // if (loading) {
  //   return <LoadingPage />;
  // }

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-4">
        <HarvestSummaryCards />
        {/* <Card className="mx-auto">
          <CardHeader>
            <CardTitle>Realized Harvest Orders</CardTitle>
            <CardDescription>
              Based on your portfolio performance for the current taxable year,
              the following orders can be excuted to reduce your tax burden.
            </CardDescription>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-primary">
                  <CardTitle className="text-sm font-medium">
                    Harvest Value
                  </CardTitle>
                  <Wheat className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Format.money(
                      Math.abs(
                        data?.harvest.realizedOrders.reduce(
                          (acc, curr) => acc + Number(curr.gainTotal),
                          0
                        ) || 0
                      )
                    )}{" "}
                    <p className="text-sm font-bold inline text-muted-foreground">
                      /{" "}
                      {Format.money(
                        Math.abs(
                          data?.harvest.portfolioSummary.harvest.realized || 0
                        )
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tax savings as high as 37%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Value
                  </CardTitle>
                  <CandlestickChart className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Format.money(
                      data?.harvest.realizedOrders.reduce(
                        (acc, curr) => acc + Number(curr.valueTotal),
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For{" "}
                    {data?.harvest.realizedOrders.reduce(
                      (acc, curr) => acc + Number(curr.quantity),
                      0
                    )}{" "}
                    shares
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cost Basis
                  </CardTitle>
                  <HandCoins className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Format.money(
                      data?.harvest.realizedOrders.reduce(
                        (acc, curr) => acc + Number(curr.costBasis),
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For{" "}
                    {data?.harvest.realizedOrders.reduce(
                      (acc, curr) => acc + Number(curr.quantity),
                      0
                    )}{" "}
                    shares
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              key="realized"
              columns={columns}
              data={data?.harvest.realizedOrders}
              noResultsAlert={
                "There are no lots that match the harvesting parameters."
              }
              loading={loading}
              error={!!error}
            />
          </CardContent>
        </Card>
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle>Unrealized Harvest Orders</CardTitle>
            <CardDescription>
              Based on your portfolio performance for the current taxable year,
              the following orders can be excuted to capture unrealized gain tax
              free.
            </CardDescription>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-primary">
                  <CardTitle className="text-sm font-medium">
                    Harvest Value
                  </CardTitle>
                  <Wheat className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Format.money(
                      Math.abs(
                        data?.harvest.unrealizedOrders.reduce(
                          (acc, curr) => acc + Number(curr.gainTotal),
                          0
                        ) || 0
                      )
                    )}{" "}
                    <p className="text-sm font-bold inline text-muted-foreground">
                      /{" "}
                      {Format.money(
                        Math.abs(
                          data?.harvest.portfolioSummary.harvest.unrealized || 0
                        )
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tax savings as high as 37%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Value
                  </CardTitle>
                  <CandlestickChart className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Format.money(
                      data?.harvest.unrealizedOrders.reduce(
                        (acc, curr) => acc + Number(curr.valueTotal),
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For{" "}
                    {data?.harvest.unrealizedOrders.reduce(
                      (acc, curr) => acc + Number(curr.quantity),
                      0
                    )}{" "}
                    shares
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cost Basis
                  </CardTitle>
                  <HandCoins className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Format.money(
                      data?.harvest.unrealizedOrders.reduce(
                        (acc, curr) => acc + Number(curr.costBasis),
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For{" "}
                    {data?.harvest.unrealizedOrders.reduce(
                      (acc, curr) => acc + Number(curr.quantity),
                      0
                    )}{" "}
                    shares
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              key="unrealized"
              columns={columns}
              data={data?.harvest.unrealizedOrders}
              noResultsAlert={
                "There are no lots that match the harvesting parameters."
              }
              loading={loading}
              error={!!error}
            />
          </CardContent>
        </Card> */}
      </div>
    </PageWrapper>
  );
}
