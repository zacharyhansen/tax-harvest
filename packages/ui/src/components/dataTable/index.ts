export { default as DataTable } from './dataTable';

export function sortDecimalValue<T>(rowA: T, rowB: T, columnId: keyof T): number {
  const statusA = Number(rowA[columnId] ?? 0);
  const statusB = Number(rowB[columnId] ?? 0);

  return Math.sign(Math.abs(Number(statusA)) - Math.abs(Number(statusB))); // Ensures correct sorting behavior
}
