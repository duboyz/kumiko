'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

// Register the SplitText plugin
gsap.registerPlugin(SplitText)

interface HeroSectionProps {}

export function HeroSection({}: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!heroRef.current || !titleRef.current) return

    // Split text into individual characters
    const splitText = new SplitText(titleRef.current, {
      type: 'chars',
    })

    // Set initial state for each character
    gsap.set(splitText.chars, {
      y: 115,
      opacity: 0,
    })

    // Create timeline and animate characters in sequence
    const tl = gsap.timeline()

    tl.to(splitText.chars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1, // 0.1 seconds between each character
    })

    tl.repeat(1).yoyo(true)

    // Cleanup function
    return () => {
      tl.kill()
      splitText.revert() // Important: revert SplitText changes
    }
  }, [])

  return (
    <div
      ref={heroRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <h1
        ref={titleRef}
        className="text-7xl font-bold text-gray-800 text-center uppercase"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          lineHeight: '5.9rem',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      >
        Kumiko
      </h1>
    </div>
  )
}
