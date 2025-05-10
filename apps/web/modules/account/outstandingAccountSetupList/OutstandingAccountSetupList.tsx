import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { toast } from '@repo/ui/components/toast-sonner'
import { cn } from '@repo/ui/utils'
import { capitalCase } from 'change-case'
import { CheckCircle, CircleCheckBig, CircleDashed } from 'lucide-react'
import Link from 'next/link'

import {
  PortfolioSummaryDocument,
  useAccountSummariesQuery,
  useUpdateAccountMutation,
} from '~/generated/gql'
import { TypedRoutes } from '~/lib/routes'
import { ErrorPage, LoadingPage } from '~/modules/utility-components'

export default function OutstandingAccountSetupList() {
  const { data, loading, error, refetch } = useAccountSummariesQuery()

  const [mutate] = useUpdateAccountMutation({
    onCompleted: () => {
      void refetch()
    },
    refetchQueries: [PortfolioSummaryDocument],
  })

  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage
        message="Could not load accounts at this time. If this issue persists please
        contact support @support"
      />
    )
  }

  return (
    <div className="space-y-2">
      {data?.accounts.map((account) => {
        const isComplete
          = (account.uploadedPositions && account.setRealizedValues)
            || account.skipSetup
        return (
          <div
            key={account.id}
            className={cn(
              'flex flex-col items-start justify-between rounded-lg border p-2 sm:flex-row sm:items-center',
              isComplete && 'border-green-300 bg-green-50',
            )}
          >
            <div className="flex flex-wrap space-x-2">
              <p>
                {' '}
                {account.name}
              </p>
              <Badge variant="secondary">{capitalCase(account.type)}</Badge>
              {account.subType
                ? (
                    <Badge variant="secondary">
                      {capitalCase(account.subType)}
                    </Badge>
                  )
                : null}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {isComplete
                ? (
                    <Badge variant="outline" className="bg-background p-2">
                      Setup Complete
                      {' '}
                      <CircleCheckBig className="ml-2 size-4 text-green-600" />
                    </Badge>
                  )
                : (
                    <>
                      <Link href={TypedRoutes.account({ id: account.id })}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          iconLeft={
                            account.uploadedPositions
                              ? (
                                  <CheckCircle className="size-4 text-green-500" />
                                )
                              : (
                                  <CircleDashed className="size-3" />
                                )
                          }
                        >
                          Upload Positions
                        </Button>
                      </Link>
                      <Link href={TypedRoutes.account({ id: account.id })}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          iconLeft={
                            account.setRealizedValues
                              ? (
                                  <CheckCircle className="size-4 text-green-500" />
                                )
                              : (
                                  <CircleDashed className="size-3" />
                                )
                          }
                        >
                          Set YTD Values
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center"
                        iconLeft={<CircleCheckBig className="size-3" />}
                        onClick={() => {
                          toast.promise(
                            mutate({
                              variables: {
                                accountWhereUniqueInput: {
                                  id: account.id,
                                },
                                accountUpdateInput: {
                                  skipSetup: {
                                    set: true,
                                  },
                                },
                              },
                            }),
                            {
                              loading: 'Skipping setup...',
                              success: 'Setup skipped',
                              error: 'Could not skip setup',
                            },
                          )
                        }}
                      >
                        Skip setup
                      </Button>
                    </>
                  )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
