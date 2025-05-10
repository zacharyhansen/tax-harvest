import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        ghost:
          "border-none p-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
