import { LoadingSpinner } from '@/components/LoadingSpinner'

interface LoadingMessageProps {
  message?: string
  centered?: boolean
  showSpinner?: boolean
}

export function LoadingMessage({
  message = 'Loading...',
  centered = true,
  showSpinner = true
}: LoadingMessageProps) {
  return (
    <div className={`flex items-center gap-2 text-muted-foreground p-4 ${
      centered ? 'justify-center' : ''
    }`}>
      {showSpinner && <LoadingSpinner size="sm" />}
      <span>{message}</span>
    </div>
  )
}