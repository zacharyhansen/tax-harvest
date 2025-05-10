import type { ReactNode } from 'react'
import LoadingIcon from './loading-icon'

export function LoadingPage({
  className,
  message,
}: {
  className?: string
  message?: ReactNode
}) {
  return (
    <div
      className={
        `flex size-full items-center justify-center ${className}`
      }
    >
      <div className="flex items-center justify-center space-x-1 text-sm">
        <LoadingIcon />
        <div>{message ?? 'Loading'}</div>
      </div>
    </div>
  )
}

export default LoadingPage
