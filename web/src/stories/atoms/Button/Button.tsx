import { Button as ShadButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  children: React.ReactNode
  onClick?: () => void
  fit?: boolean
}
export const Button = ({ variant, children, onClick, fit = false }: ButtonProps) => {
  if (variant === 'default') return <PrimaryButton onClick={onClick}>{children}</PrimaryButton>
  if (variant === 'secondary') return <SecondaryButton onClick={onClick}>{children}</SecondaryButton>
  if (variant === 'outline') return <OutlineButton onClick={onClick} fit={fit}>{children}</OutlineButton>

  return <ShadButton variant={variant} onClick={onClick}>{children}</ShadButton>
}

const PrimaryButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return <ShadButton className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-none" onClick={onClick}>{children}</ShadButton>
}

const SecondaryButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return <ShadButton variant="secondary" className="rounded-none border-1 border-gray-200 bg-transparent shadow-none font-sans" onClick={onClick}>{children}</ShadButton>
}

const OutlineButton = ({ children, onClick, fit = false }: { children: React.ReactNode, onClick?: () => void, fit?: boolean }) => {
  return <ShadButton variant="outline" className={cn("rounded-none border-1 border-gray-200 bg-transparent shadow-none font-sans", fit && "w-fit")} onClick={onClick}>{children}</ShadButton>
}