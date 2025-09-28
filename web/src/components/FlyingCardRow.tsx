'use client'

import { FlyingCard } from './FlyingCard'

interface FlyingCardRowProps {
  index: number
  leftImage: string
  rightImage: string
  leftAlt: string
  rightAlt: string
}

export function FlyingCardRow({ index, leftImage, rightImage, leftAlt, rightAlt }: FlyingCardRowProps) {
  return (
    <div className="row">
      <FlyingCard src={leftImage} alt={leftAlt} className="card card-left" index={index} direction="left" />
      <FlyingCard src={rightImage} alt={rightAlt} className="card card-right" index={index} direction="right" />
    </div>
  )
}
