import type { ReactNode } from 'react';

interface FooterCellProps {
  value: ReactNode;
  label: string;
}

export default function FooterCell({ label, value }: FooterCellProps) {
  return (
    <div className="flex flex-col">
      <p className="text-secondary-foreground text-xs">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
