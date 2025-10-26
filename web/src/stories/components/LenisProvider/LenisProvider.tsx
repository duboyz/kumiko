'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollProgress } from '../ScrollProgress'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface LenisProviderProps {
  children: React.ReactNode
  showScrollProgress?: boolean
}

export const LenisProvider = ({ children, showScrollProgress = true }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with enhanced configuration
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
      // Enhanced features
      lerp: 0.1, // Lower lerp for more responsive feel
      wheelMultiplier: 1,
      // Enable anchor links for smooth navigation
      syncTouch: true,
    })

    // Expose Lenis instance globally for SmoothScrollLink
    ;(window as any).lenis = lenisRef.current

    // Sync Lenis with GSAP ScrollTrigger for perfect animations
    lenisRef.current.on('scroll', ScrollTrigger.update)

    // Enhanced scroll event handling
    lenisRef.current.on('scroll', e => {
      // You can add custom scroll-based logic here
      // For example: parallax effects, scroll progress, etc.
    })

    // Animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
      ;(window as any).lenis = null
    }
  }, [])

  return (
    <>
      {showScrollProgress && <ScrollProgress />}
      {children}
    </>
  )
}
