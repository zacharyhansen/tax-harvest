import type { DatasetOutput, DataviewOutput } from './dataset.dto';

export function findDataviewById(
  dataset: DatasetOutput,
  targetId: string
): DataviewOutput | null {
  if (!dataset.dataview) return null;

  const queue: DataviewOutput[] = [dataset.dataview];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.id === targetId) return current;
    if (current.dataview_column)
      for (const column of current.dataview_column) {
        if (column.child_dataview) {
          queue.push(column.child_dataview);
        }
      }
  }

  return null;
}

export function findParentColumnOfDataviewById(
  dataset: DatasetOutput,
  targetId: string
): { columnId: string; parentDataview: DataviewOutput } | null {
  if (!dataset.dataview) return null;

  const queue: DataviewOutput[] = [dataset.dataview];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.id === targetId) return null;
    if (current.dataview_column)
      for (const column of current.dataview_column) {
        if (column.child_dataview) {
          if (column.child_dataview_id === targetId)
            return { columnId: column.id, parentDataview: current };
          queue.push(column.child_dataview);
        }
      }
  }

  return null;
}
