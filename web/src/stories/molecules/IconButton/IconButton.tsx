import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'

interface IconButtonProps {
  icon: LucideIcon
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      children,
      onClick,
      variant = 'default',
      size = 'default',
      disabled = false,
      className = '',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        variant={variant}
        size={size}
        disabled={disabled}
        className={className + ' rounded-none'}
        aria-label={ariaLabel}
        {...props}
      >
        <Icon className="h-4 w-4 mr-2" />
        {children}
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'
