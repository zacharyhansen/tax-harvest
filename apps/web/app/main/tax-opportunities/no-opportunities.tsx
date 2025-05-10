import { Button } from '@repo/ui/components/button'

import { Info } from 'lucide-react'

import Link from 'next/link'
import { TypedRoutes } from '~/lib/routes'

export default function NoOpportunities() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border-0">
        <div className="flex flex-col items-center justify-center p-10">
          <div className="mb-4 rounded-full p-3">
            <Info className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">
            No Available Opportunities
          </h3>
          <p className="max-w-lg text-center text-muted-foreground">
            Check back later as market conditions change, or consider
            diversifying your portfolio to create more potential
            harvesting opportunities.
          </p>
          <div className="mt-6">
            <Link href={TypedRoutes.home()}>
              <Button variant="outline">View Portfolio</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
