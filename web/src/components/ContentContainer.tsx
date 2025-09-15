import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContentContainerProps {
  children: ReactNode
  className?: string
}

export function ContentContainer({ children, className }: ContentContainerProps) {
  return (
    <div className={cn('flex flex-col gap-4 p-4', className)}>
      {children}
    </div>
  )
}