'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GSAPProviderProps {
  children: React.ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    // Set default ScrollTrigger settings
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
