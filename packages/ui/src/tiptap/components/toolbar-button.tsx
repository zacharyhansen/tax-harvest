import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import { Toggle } from "@repo/ui/components/toggle";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/utils";
import * as React from "react";

type ToolbarButtonProps = {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipContentProps;
} & React.ComponentPropsWithoutRef<typeof Toggle>;

export const ToolbarButton = ({
  ref,
  isActive,
  children,
  tooltip,
  className,
  tooltipOptions,
  ...props
}: ToolbarButtonProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const toggleButton = (
    <Toggle
      size="sm"
      ref={ref}
      className={cn("size-8 p-0", { "bg-accent": isActive }, className)}
      {...props}
    >
      {children}
    </Toggle>
  );

  if (!tooltip) {
    return toggleButton;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
      <TooltipContent {...tooltipOptions}>
        <div className="flex flex-col items-center text-center">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  );
};

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
