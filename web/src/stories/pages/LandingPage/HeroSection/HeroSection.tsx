'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { bebasNeue } from '@shared'
import Image from 'next/image'
import HeroImage from '../assets/heroImage.png?url'

// Register the SplitText plugin
gsap.registerPlugin(SplitText)

interface HeroSectionProps {}

export function HeroSection({}: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Individual line refs for staggered animation
  const line1Ref = useRef<HTMLSpanElement>(null) // DIGITIZE YOUR
  const line2Ref = useRef<HTMLSpanElement>(null) // RESTAURANT
  const line3Ref = useRef<HTMLSpanElement>(null) // IN
  const line4Ref = useRef<HTMLSpanElement>(null) // MINUTES
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !heroRef.current ||
      !titleRef.current ||
      !heroContentRef.current ||
      !heroTextRef.current ||
      !buttonRef.current ||
      !line1Ref.current ||
      !line2Ref.current ||
      !line3Ref.current ||
      !line4Ref.current ||
      !descriptionRef.current ||
      !heroImageRef.current
    )
      return

    // Split text into individual characters for Kumiko logo
    const splitText = new SplitText(titleRef.current, {
      type: 'chars',
    })

    // Split each hero text line into characters
    const splitLine1 = new SplitText(line1Ref.current, { type: 'chars' })
    const splitLine2 = new SplitText(line2Ref.current, { type: 'chars' })
    const splitLine3 = new SplitText(line3Ref.current, { type: 'chars' })
    const splitLine4 = new SplitText(line4Ref.current, { type: 'chars' })

    // Animation configuration - easy to adjust timing
    const config = {
      kumikoIn: { duration: 0.5, stagger: 0.1 },
      kumikoHold: { duration: 0.3 },
      kumikoOut: { duration: 0.4, stagger: 0.05 },
      lineDelay: 0.05, // Delay between each line (reduced from 0.3)
      lineDuration: 0.4, // Faster line animation (reduced from 0.6)
      descriptionDelay: 0.1, // Faster description (reduced from 0.2)
      buttonDelay: 0.1, // Faster button (reduced from 0.2)
    }

    // Set initial states
    gsap.set(splitText.chars, { y: 115, opacity: 0 })

    // Set initial states for hero text characters (coming from above)
    gsap.set(splitLine1.chars, { y: -50, opacity: 0 })
    gsap.set(splitLine2.chars, { y: -50, opacity: 0 })
    gsap.set(splitLine3.chars, { y: -50, opacity: 0 })
    gsap.set(splitLine4.chars, { y: -50, opacity: 0 })
    gsap.set(descriptionRef.current, { y: 20, opacity: 0 })
    gsap.set(buttonRef.current, { y: 20, opacity: 0 })
    gsap.set(heroImageRef.current, { x: 100, opacity: 0, scale: 0.8 })

    // Create master timeline
    const tl = gsap.timeline()

    // Phase 1: Kumiko logo animation in
    tl.to(splitText.chars, {
      y: 0,
      opacity: 1,
      duration: config.kumikoIn.duration,
      ease: 'power2.out',
      stagger: config.kumikoIn.stagger,
    })

    // Phase 2: Hold Kumiko logo
    tl.to({}, { duration: config.kumikoHold.duration })

    // Phase 3: Kumiko logo animation out
    tl.to(splitText.chars, {
      y: -115,
      opacity: 0,
      duration: config.kumikoOut.duration,
      ease: 'power2.in',
      stagger: config.kumikoOut.stagger,
    })

    // Phase 4: Animate hero text characters one by one
    tl.to(splitLine1.chars, {
      y: 0,
      opacity: 1,
      duration: config.lineDuration,
      ease: 'power2.out',
      stagger: 0.05,
    })

    tl.to(
      splitLine2.chars,
      {
        y: 0,
        opacity: 1,
        duration: config.lineDuration,
        ease: 'power2.out',
        stagger: 0.05,
      },
      `+=${config.lineDelay}`
    )

    tl.to(
      splitLine3.chars,
      {
        y: 0,
        opacity: 1,
        duration: config.lineDuration,
        ease: 'power2.out',
        stagger: 0.05,
      },
      `+=${config.lineDelay}`
    )

    tl.to(
      splitLine4.chars,
      {
        y: 0,
        opacity: 1,
        duration: config.lineDuration,
        ease: 'power2.out',
        stagger: 0.05,
      },
      `+=${config.lineDelay}`
    )

    // Phase 5: Description comes in
    tl.to(
      descriptionRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      `+=${config.descriptionDelay}`
    )

    // Phase 6: Button comes in
    tl.to(
      buttonRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
      },
      `+=${config.buttonDelay}`
    )

    // Phase 7: Hero image slides in from the right
    tl.to(
      heroImageRef.current,
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      `+=0.3`
    )

    // Cleanup function
    return () => {
      tl.kill()
      splitText.revert()
      splitLine1.revert()
      splitLine2.revert()
      splitLine3.revert()
      splitLine4.revert()
    }
  }, [])

  return (
    <div
      ref={heroRef}
      className={`min-h-screen flex items-center justify-center from-gray-50 to-gray-100 relative overflow-hidden pt-16 ${bebasNeue.className}`}
    >
      {/* Title Section */}
      <h1
        ref={titleRef}
        className="absolute text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-800 text-center uppercase z-10"
        style={{
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          lineHeight: 'clamp(4.5rem, 13vw, 10rem)',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      >
        Kumiko
      </h1>

      {/* Hero Content Section */}
      <div
        ref={heroContentRef}
        className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-8 z-20 gap-8 lg:gap-16"
        style={{ perspective: '1000px' }}
      >
        {/* Hero Text - Left side on desktop, centered on mobile */}
        <div
          ref={heroTextRef}
          className="text-center lg:text-left px-4 flex-1"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-800 mb-6 sm:mb-8 leading-tight">
            <span ref={line1Ref} className="inline">
              DIGITIZE YOUR
            </span>{' '}
            <br />
            <span ref={line2Ref} className="inline">
              RESTAURANT
            </span>{' '}
            <br />
            <span ref={line3Ref} className="inline">
              IN
            </span>{' '}
            <span ref={line4Ref} className="inline">
              MINUTES
            </span>
          </h2>
          <p
            ref={descriptionRef}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 lg:px-0"
          >
            Transform your paper menu into a stunning digital experience. Get a beautiful, fresh website that's
            optimized for food ordering and ready to take orders immediately—all without any technical skills required.
          </p>
          <button
            ref={buttonRef}
            className="group relative bg-black text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800"
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
            onClick={() => {
              // Simple navigation that works in both Next.js and Storybook
              if (typeof window !== 'undefined') {
                window.location.href = '/register'
              }
            }}
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Hero Image - Right side on desktop, below text on mobile */}
        <div ref={heroImageRef} className="flex-1 max-w-lg lg:max-w-xl">
          <Image
            src={HeroImage}
            alt="Kumiko - Digital Restaurant Solution"
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
