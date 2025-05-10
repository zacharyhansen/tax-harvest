import * as React from "react";

import { cn } from "../utils";

const Textarea = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"textarea"> & {
  ref?: React.RefObject<HTMLTextAreaElement | null>;
}) => {
  return (
    <textarea
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
