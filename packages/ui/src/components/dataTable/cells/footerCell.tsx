import type { ReactNode } from "react";

type FooterCellProps = {
  value: ReactNode;
  label: string;
};

export default function FooterCell({ label, value }: FooterCellProps) {
  return (
    <div className="flex flex-col">
      <p className="text-xs text-secondary-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
