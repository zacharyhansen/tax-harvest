import type { TablesFoundation } from '~/lib/database/helpers';

export function DealOption({
  deal,
}: {
  deal: Partial<TablesFoundation<'deal'>> & {
    opportunity?: Partial<TablesFoundation<'opportunity'>> | null;
  };
}) {
  return (
    <div className="flex flex-col items-start">
      <p className="text-sm">{deal.label}</p>
      <p className="text-muted-foreground text-xs">
        Opportunity: {deal.opportunity ? deal.opportunity.label : 'none'}
      </p>
    </div>
  );
}
