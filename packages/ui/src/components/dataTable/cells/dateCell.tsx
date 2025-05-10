import type { CellContext } from "@tanstack/react-table";

import { cn } from "@repo/ui/utils/cn";
import { DateFormatter } from "@repo/ui/utils/date-formatter";

export default function DateCell<TData, TValue>({
  getValue,
}: CellContext<TData, TValue>) {
  if (!getValue()) {
    return null;
  }

  return (
    <div className={cn("font-medium")}>
      {DateFormatter.shortDay(getValue<string | Date | null | undefined>())}
    </div>
  );
}
