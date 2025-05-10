import type { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Input } from "../../input";

export default function EditableCell<TData, TValue>({
  column: { id },
  editable,
  getValue,
  row: { index },
  table,
}: CellContext<TData, TValue> & {
  editable?: boolean;
}) {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState<TValue>(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    // table.options.meta?.updateData(index, id, value);
    table.options.meta?.updateCell(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return initialValue;
  }

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value as TValue)}
      onBlur={onBlur}
      type="number"
    />
  );
}
