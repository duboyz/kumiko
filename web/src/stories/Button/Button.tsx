import { Button as ShadButton } from '@/components/ui/button'

interface ButtonProps {
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  children: React.ReactNode
}
export const Button = ({ variant, children }: ButtonProps) => {
  return <ShadButton variant={variant}>{children}</ShadButton>
}
