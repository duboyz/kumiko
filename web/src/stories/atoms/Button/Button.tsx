import { Button as ShadButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  children: React.ReactNode
  onClick?: () => void
  fit?: boolean
  className?: string
}
export const Button = ({ variant, children, onClick, fit = false, className }: ButtonProps) => {
  if (variant === 'default') return <PrimaryButton onClick={onClick} className={className}>{children}</PrimaryButton>
  if (variant === 'secondary') return <SecondaryButton onClick={onClick} fit={fit} className={className}>{children}</SecondaryButton>
  if (variant === 'outline') return <OutlineButton onClick={onClick} fit={fit} className={className}>{children}</OutlineButton>
  if (variant === 'ghost') return <GhostButton onClick={onClick} fit={fit} className={className}>{children}</GhostButton>
  if (variant === 'link') return <LinkButton onClick={onClick} fit={fit} className={className}>{children}</LinkButton>

  return <ShadButton variant={variant} onClick={onClick} className={className}>{children}</ShadButton>
}

const PrimaryButton = ({ children, onClick, fit = false, className }: { children: React.ReactNode, onClick?: () => void, fit?: boolean, className?: string }) => {
  return <ShadButton className={cn("bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-none", fit && "w-fit", className)} onClick={onClick}>{children}</ShadButton>
}

const SecondaryButton = ({ children, onClick, fit = false, className }: { children: React.ReactNode, onClick?: () => void, fit?: boolean, className?: string }) => {
  return <ShadButton variant="secondary" className={cn("rounded-none border-1 border-gray-200 bg-transparent shadow-none font-sans", fit && "w-fit", className)} onClick={onClick}>{children}</ShadButton>
}

const OutlineButton = ({ children, onClick, fit = false, className }: { children: React.ReactNode, onClick?: () => void, fit?: boolean, className?: string }) => {
  return <ShadButton variant="outline" className={cn("rounded-none border-1 border-gray-200 bg-transparent shadow-none font-sans", fit && "w-fit", className)} onClick={onClick}>{children}</ShadButton>
}

const GhostButton = ({ children, onClick, fit = false, className }: { children: React.ReactNode, onClick?: () => void, fit?: boolean, className?: string }) => {
  return <ShadButton variant="ghost" className={cn("rounded-none border-1 border-gray-200 bg-transparent shadow-none font-sans", fit && "w-fit", className)} onClick={onClick}>{children}</ShadButton>
}

const LinkButton = ({ children, onClick, fit = false, className }: { children: React.ReactNode, onClick?: () => void, fit?: boolean, className?: string }) => {
  return <ShadButton variant="link" className={cn("rounded-none border-1 border-gray-200 bg-transparent shadow-none font-sans", fit && "w-fit", className)} onClick={onClick}>{children}</ShadButton>
}