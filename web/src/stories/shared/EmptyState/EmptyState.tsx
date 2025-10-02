import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link'
  }
  actionComponent?: React.ReactNode
  variant?: 'default' | 'compact'
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionComponent,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className={cn('text-center', variant === 'compact' ? 'py-8' : 'py-12')}>
        <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        {actionComponent ? (
          actionComponent
        ) : action ? (
          // TODO: This should be a link so that we can use SSR
          <Button variant={action.variant || 'default'} onClick={action.onClick}>
            {action.label}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
