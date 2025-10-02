import { LoadingSpinner } from '@/components'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'spinner' | 'centered' | 'page' | 'inline'
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ variant = 'centered', message, size = 'lg', className }: LoadingStateProps) {
  if (variant === 'spinner') {
    return <LoadingSpinner size={size} />
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <LoadingSpinner size={size} />
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    )
  }

  if (variant === 'page') {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-screen', className)}>
        <LoadingSpinner size={size} />
        {message && <p className="text-muted-foreground mt-4">{message}</p>}
      </div>
    )
  }

  // Default: centered
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[400px]', className)}>
      <LoadingSpinner size={size} />
      {message && <p className="text-muted-foreground mt-4">{message}</p>}
    </div>
  )
}
