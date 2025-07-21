'use client'

import { Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { 
  usePlaidAuthConnectionsQuery, 
  usePlaidLinkTokenQuery 
} from '~/generated/gql'
import { TypedRoutes } from '~/lib/routes'
import { NoAccounts } from '~/modules/account'
import { PageWrapper } from '~/modules/layout'
import { InstitutionCard } from '~/modules/plaid'
import PlaidLink from '~/modules/plaid/PlaidLink'
import { ErrorPage, LoadingPage, LoadingIcon } from '~/modules/utility-components'

export default function AccountPage() {
  const router = useRouter()
  const { data: linkTokenData } = usePlaidLinkTokenQuery()
  const { data: authConnectionsData, loading: authConnectionsLoading, error } = 
    usePlaidAuthConnectionsQuery()

  const handleAccountClick = (accountId: string) => {
    router.push(TypedRoutes.account({ id: accountId }))
  }

  if (authConnectionsLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage message="Could not load accounts at this time. If this issue persists please contact support" />
    )
  }

  const hasConnections =
    authConnectionsData?.plaidAuthConnections &&
    authConnectionsData.plaidAuthConnections.length > 0

  if (!hasConnections) {
    return <NoAccounts />
  }

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-card rounded-lg border">
          <div className="border-b p-6">
            <h1 className="text-2xl font-semibold">Your Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your connected financial institutions and accounts
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Connected Institutions
                </h2>
                <div className="space-y-4">
                  {authConnectionsData.plaidAuthConnections.map(
                    authConnection => (
                      <InstitutionCard
                        key={authConnection.id}
                        authConnection={authConnection}
                        onAccountClick={handleAccountClick}
                        redirectTo="/main/accounts"
                      />
                    )
                  )}
                </div>
              </div>

              {/* Link New Institution Button */}
              <div className="mt-8 border-t pt-8">
                <div className="text-center">
                  <h3 className="mb-2 text-base font-medium">
                    Need to connect a different institution?
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Link accounts from another bank or brokerage
                  </p>
                  {linkTokenData?.linkToken ? (
                    <PlaidLink
                      token={linkTokenData.linkToken}
                      redirectTo="/main/accounts"
                      size="lg"
                      variant="default"
                      iconLeft={<Building2 className="h-5 w-5" />}
                    >
                      Link New Institution
                    </PlaidLink>
                  ) : (
                    <LoadingIcon className="mx-auto my-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
