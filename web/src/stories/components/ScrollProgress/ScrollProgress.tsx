'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ScrollProgressProps {
  className?: string
}

export const ScrollProgress = ({ className = '' }: ScrollProgressProps) => {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!progressRef.current) return

    // Create scroll progress animation
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === 'body') trigger.kill()
      })
    }
  }, [])

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 ${className}`}>
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 origin-left scale-x-0"
        style={{ transformOrigin: 'left' }}
      />
    </div>
  )
}
