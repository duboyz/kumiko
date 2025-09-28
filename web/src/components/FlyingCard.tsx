'use client'

import { useFlyingCardAnimation } from '@/hooks/useFlyingCardAnimation'

interface FlyingCardProps {
  src: string
  alt: string
  className: string
  index: number
  direction: 'left' | 'right'
}

export function FlyingCard({ src, alt, className, index, direction }: FlyingCardProps) {
  const cardRef = useFlyingCardAnimation({ index, direction })

  return (
    <div ref={cardRef} className={className}>
      <img src={src} alt={alt} width={100} height={100} />
    </div>
  )
}
