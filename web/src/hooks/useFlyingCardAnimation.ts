'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface AnimationConfig {
  x: number
  y: number
  rotation: number
}

interface UseFlyingCardAnimationProps {
  index: number
  direction: 'left' | 'right'
  trigger?: string
  start?: string
  end?: string
}

const animationValues = {
  left: {
    x: [-800, -900, -400],
    rotation: [-30, -20, -35],
  },
  right: {
    x: [800, 900, 400],
    rotation: [30, 20, 35],
  },
}

const yValues = [100, -150, -400]

export function useFlyingCardAnimation({
  index,
  direction,
  trigger = '.main',
  start = 'top center',
  end = '150% bottom',
}: UseFlyingCardAnimationProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const card = cardRef.current
    const xValue = animationValues[direction].x[index]
    const rotationValue = animationValues[direction].rotation[index]
    const yValue = yValues[index]

    const animation = gsap.to(card, {
      x: xValue,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: true,
        onUpdate: self => {
          const progress = self.progress
          card.style.transform = `translateX(${progress * xValue}px) translateY(${
            progress * yValue
          }px) rotate(${progress * rotationValue}deg)`
        },
      },
    })

    return () => {
      animation.kill()
    }
  }, [index, direction, trigger, start, end])

  return cardRef
}
