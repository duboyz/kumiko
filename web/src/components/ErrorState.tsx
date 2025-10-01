import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  variant?: 'alert' | 'card' | 'inline'
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function ErrorState({ title = 'Error', message, variant = 'card', action, className }: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-destructive', className)}>
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{message}</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{message}</CardDescription>
          {action && (
            <Button variant="outline" onClick={action.onClick} className="mt-4">
              {action.label}
            </Button>
          )}
        </CardHeader>
      </Card>
    )
  }

  // Default: alert variant (can be expanded)
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  )
}
