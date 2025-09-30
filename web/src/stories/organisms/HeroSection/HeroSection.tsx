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
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !heroRef.current ||
      !titleRef.current ||
      !heroContentRef.current ||
      !heroTextRef.current ||
      !heroImageRef.current
    )
      return

    // Split text into individual characters
    const splitText = new SplitText(titleRef.current, {
      type: 'chars',
    })

    // Set initial states
    gsap.set(splitText.chars, {
      y: 115,
      opacity: 0,
    })

    gsap.set(heroContentRef.current, {
      opacity: 0,
    })

    gsap.set(heroTextRef.current, {
      x: -100,
      opacity: 0,
    })

    gsap.set(heroImageRef.current, {
      x: 100,
      opacity: 0,
    })

    // Create master timeline
    const tl = gsap.timeline()

    // Phase 1: Title animation in
    tl.to(splitText.chars, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
    })

    // Phase 2: Hold for a moment
    tl.to({}, { duration: 1 })

    // Phase 3: Title animation out
    tl.to(splitText.chars, {
      y: -115,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.05,
    })

    // Phase 4: Hero content appears
    tl.to(
      heroContentRef.current,
      {
        opacity: 1,
        duration: 0.3,
      },
      '-=0.2'
    )

    // Phase 5: Text and image slide in
    tl.to(
      heroTextRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.1'
    )

    tl.to(
      heroImageRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    )

    // Cleanup function
    return () => {
      tl.kill()
      splitText.revert()
    }
  }, [])

  return (
    <div
      ref={heroRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative"
    >
      {/* Title Section */}
      <h1
        ref={titleRef}
        className="absolute text-7xl font-bold text-gray-800 text-center uppercase"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 400,
          // lineHeight: '5.9rem',
          lineHeight: '5.9rem',

          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      >
        Kumiko
      </h1>

      {/* Hero Content Section */}
      <div ref={heroContentRef} className="flex items-center justify-between w-full max-w-6xl mx-auto px-8">
        {/* Hero Text */}
        <div ref={heroTextRef} className="flex-1 pr-8">
          <h2
            className="text-5xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
          >
            Welcome to Kumiko
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience the finest dining with our carefully curated menu featuring seasonal ingredients and innovative
            cooking techniques that honor tradition while embracing creativity.
          </p>
          <button className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors">
            Reserve a Table
          </button>
        </div>

        {/* Hero Image */}
        <div ref={heroImageRef} className="flex-1 pl-8">
          <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500 text-lg">Hero Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  )
}
