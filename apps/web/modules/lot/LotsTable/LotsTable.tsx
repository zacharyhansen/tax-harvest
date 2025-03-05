'use client';

import columns from './LotsTable.ColumnDef';

import { LoadingPage } from '~/modules/utility-components';

export default function LotsTable() {
  // const { data, error, loading } = usePortfolioLotsQuery();

  // if (loading) {
  //   return <LoadingPage />;
  // }

  return <div>LotsTable</div>;
  // return (
  //   <DataTable
  //     columns={columns}
  //     data={data?.lots}
  //     noResultsAlert={"This portfolio has no positions."}
  //     loading={loading}
  //     error={!!error}
  //     initialState={{
  //       expanded: true,
  //       grouping: ["assetSymbol"],
  //       pagination: {
  //         pageIndex: 0,
  //         pageSize: data?.lots.length || 0,
  //       },
  //     }}
  //     customAggregationFns={{
  //       avgPricePaid: (_columnId, leafRows) => {
  //         let totalQuantity = 0;
  //         let totalPaid = 0;
  //         leafRows.forEach((row) => {
  //           const qty = Number(row.original["remainingQty"]) || 0;
  //           totalQuantity += qty;
  //           totalPaid += (Number(row.original["price"]) || 0) * qty;
  //         });
  //         return Format.money(totalPaid / totalQuantity, 4);
  //       },
  //       totalGainPct: (_columnId, leafRows) => {
  //         let totalGain = 0;
  //         let totalPaid = 0;
  //         leafRows.forEach((row) => {
  //           row.getValue;
  //           totalGain += Number(row.getValue("totalGain")) || 0;
  //           totalPaid += Number(row.getValue("costBasis")) || 0;
  //         });
  //         return new Intl.NumberFormat("en-US", {
  //           maximumFractionDigits: 2,
  //           style: "percent",
  //         }).format(totalGain / totalPaid);
  //       },
  //     }}
  //   />
  // );
}
