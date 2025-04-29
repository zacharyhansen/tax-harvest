import type { SortingFn } from '@tanstack/react-table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortDecimalValue: SortingFn<any> = (rowA, rowB, columnId) => {
  const statusA = Number(rowA.original[columnId] ?? 0);
  const statusB = Number(rowB.original[columnId] ?? 0);

  return Math.sign(Math.abs(Number(statusA)) - Math.abs(Number(statusB))); // Ensures correct sorting behavior
};
