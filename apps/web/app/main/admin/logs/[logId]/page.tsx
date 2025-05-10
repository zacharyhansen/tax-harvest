'use client'
import ReactJsonView from '@microlink/react-json-view'

import { useTheme } from 'next-themes'
import { use } from 'react'

import { useLogQuery } from '~/generated/gql'
import { TypedRoutes } from '~/lib/routes'
import { PageWrapper } from '~/modules/layout'
import { ErrorPage, LoadingPage } from '~/modules/utility-components'

export default function LogPage(props: {
  params: Promise<typeof TypedRoutes.log.params>
}) {
  const params = use(props.params)
  const theme = useTheme()
  const safeParams = TypedRoutes.log.parse(params)

  const { data, error, loading } = useLogQuery({
    variables: { logId: safeParams.logId },
  })

  if (error) {
    return <ErrorPage message={JSON.stringify(error)} />
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <PageWrapper
      title="Log Explorer"
      description={(
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <span className="font-bold">ID:</span>
            <span>{data?.log?.id}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Description:</span>
            <span>{data?.log?.description}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Type:</span>
            <span>{data?.log?.type}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Source:</span>
            <span>{data?.log?.source}</span>
          </div>
        </div>
      )}
    >
      <ReactJsonView
        src={data?.log?.data}
        theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
        displayDataTypes={false}
        indentWidth={6}
      />
    </PageWrapper>
  )
}
