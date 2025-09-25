import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContentContainerProps {
  children: ReactNode
}

export function ContentContainer({ children }: ContentContainerProps) {
  return <div className={cn('flex flex-col gap-4 p-4')}>{children}</div>
}
