'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import Image from 'next/image'
import searchImage from '../assets/search.png'
import picImage from '../assets/pic.png'
import globeImage from '../assets/globe.png'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface FlowSectionProps {}

// Step data configuration
const steps = [
  {
    id: 1,
    title: 'Find Your Business',
    description: "Sign up and tell us about your restaurant. We'll help you get started in just a few minutes.",
    image: searchImage,
  },
  {
    id: 2,
    title: 'Take Picture of Menu',
    description: 'Snap a photo of your menu with your phone. Our AI will instantly digitize and organize it for you.',
    image: picImage,
  },
  {
    id: 3,
    title: 'Make It Live',
    description: 'Your digital menu is now live! Customers can browse, order, and make reservations instantly.',
    image: globeImage,
  },
] as const

export function FlowSection({}: FlowSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || stepRefs.current.some(ref => !ref)) return

    // Set initial states - all steps hidden
    gsap.set(titleRef.current, { y: 50, opacity: 0 })

    // Set initial states for each step with alternating directions
    stepRefs.current.forEach((stepRef, index) => {
      if (!stepRef) return

      const isEven = index % 2 === 1 // Step 2 (index 1) comes from right
      gsap.set(stepRef, {
        x: isEven ? 200 : -200,
        opacity: 0,
        scale: 0.8,
        rotation: isEven ? 5 : -5,
      })
    })

    // Title animation
    gsap.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    // Animate each step
    stepRefs.current.forEach((stepRef, index) => {
      if (!stepRef) return

      gsap.to(stepRef, {
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: stepRef,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`flex items-center px-8 !bg-black rounded-[4rem] ${bebasNeue.className}`}
      style={{ backgroundColor: 'black', borderRadius: '4rem 4rem 0 0', paddingTop: '50px' }}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Title */}
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-center !text-white mb-20">
          How It Works
        </h2>

        {/* Flow Steps - Vertical Layout */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={el => {
                stepRefs.current[index] = el
              }}
              className="flex items-center gap-12"
              style={{ marginBottom: '20%' }}
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image src={step.image} alt={step.title} width={96} height={96} className="object-contain" />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-white bg-white/10 px-3 py-1 rounded-full">{step.id}</span>
                  <h3 className="text-3xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-300 text-xl leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
