import { cn } from '@repo/ui/utils'

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      className={cn('h-6 w-6 animate-spin', className)}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default LoadingIcon
