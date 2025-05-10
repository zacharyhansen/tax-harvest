import type React from 'react'
import type { ReactNode } from 'react'
import type { UserItemFragment } from '~/generated/gql'

import { createContext, use, useMemo } from 'react'
import { useUserQuery } from '~/generated/gql'
import { ErrorPage, LoadingPage } from '~/modules/utility-components'

type UserContextType = {
  user: UserItemFragment
}

const UserContext = createContext<UserContextType | undefined>(undefined)

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data, error, loading } = useUserQuery()

  const value = useMemo(
    () => ({
      user: {
        ...data?.userCurrent,
      },
    }),
    [data],
  )

  if (loading) {
    return <LoadingPage />
  }

  if (!value.user) {
    console.error(JSON.stringify(error))
    return <ErrorPage message="Unable to find user in system." />
  }

  // @ts-expect-error typing issues
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom hook to use the UserContext
export function useUser(): UserContextType {
  const context = use(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
