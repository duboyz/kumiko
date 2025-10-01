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
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (
      !heroRef.current ||
      !titleRef.current ||
      !heroContentRef.current ||
      !heroTextRef.current ||
      !heroImageRef.current ||
      !buttonRef.current
    )
      return

    // Split text into individual characters
    const splitText = new SplitText(titleRef.current, {
      type: 'chars',
    })

    // Set initial states with more dramatic positioning
    gsap.set(splitText.chars, {
      y: 115,
      opacity: 0,
    })

    gsap.set(heroContentRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 50,
    })

    gsap.set(heroTextRef.current, {
      x: -150,
      opacity: 0,
      rotationY: -45,
    })

    gsap.set(heroImageRef.current, {
      x: 150,
      opacity: 0,
      rotationY: 45,
      scale: 0.8,
    })

    gsap.set(buttonRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.9,
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
    tl.to({}, { duration: 0.1 })

    // Phase 3: Title animation out
    tl.to(splitText.chars, {
      y: -115,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.05,
    })

    // Phase 4: Hero content appears with elegant entrance
    tl.to(
      heroContentRef.current,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      '-=0.2'
    )

    // Phase 5: Text slides in with 3D rotation
    tl.to(
      heroTextRef.current,
      {
        x: 0,
        opacity: 1,
        rotationY: 0,
        duration: 1.2,
        ease: 'power3.out',
      },
      '-=0.4'
    )

    // Phase 6: Image slides in with scale and rotation
    tl.to(
      heroImageRef.current,
      {
        x: 0,
        opacity: 1,
        rotationY: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      },
      '-=0.8'
    )

    // Phase 7: Button appears with bounce
    tl.to(
      buttonRef.current,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
      },
      '-=0.4'
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* Title Section */}
      <h1
        ref={titleRef}
        className="absolute text-7xl font-bold text-gray-800 text-center uppercase z-10"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 400,
          fontSize: '9rem',
          lineHeight: '10rem',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      >
        Kumiko
      </h1>

      {/* Hero Content Section */}
      <div
        ref={heroContentRef}
        className="flex items-center justify-between w-full max-w-7xl mx-auto px-8 z-20"
        style={{ perspective: '1000px' }}
      >
        {/* Hero Text */}
        <div ref={heroTextRef} className="flex-1 pr-12" style={{ transformStyle: 'preserve-3d' }}>
          <h2
            className="text-6xl font-bold text-gray-800 mb-8 leading-tight"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
            }}
          >
            Welcome to Kumiko
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
            Experience the finest dining with our carefully curated menu featuring seasonal ingredients and innovative
            cooking techniques that honor tradition while embracing creativity.
          </p>
          <button
            ref={buttonRef}
            className="group relative bg-gray-800 text-white px-10 py-5 rounded-2xl text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-700"
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <span className="relative z-10">Reserve a Table</span>
            <div className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Hero Image */}
        <div ref={heroImageRef} className="flex-1 pl-12" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="w-full h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center relative overflow-hidden border border-gray-200"
            style={{
              boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
            }}
          >
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <span className="text-gray-500 text-lg font-medium">Hero Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
