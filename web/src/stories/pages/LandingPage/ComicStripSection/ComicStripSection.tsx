'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import kumikoSnap from './assets/kumiko-snap.png'
import kumikoDeploy from './assets/kumiko-deploy.png'
import kumikoOrders from './assets/kumiko-orders.png'
import kumikoServed from './assets/kumiko-served.png'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ComicStripSectionProps {}

export function ComicStripSection({}: ComicStripSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const desktopImageRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobileImageRefs = useRef<(HTMLDivElement | null)[]>([])
  const descriptionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepTitleRef = useRef<HTMLHeadingElement>(null)
  const stepDescriptionRef = useRef<HTMLParagraphElement>(null)
  const stepNumberRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([])
  const scrollListenerRef = useRef<(() => void) | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  // Use desktop refs for desktop viewport, mobile refs for mobile
  const imageRefs = windowWidth >= 1024 ? desktopImageRefs : mobileImageRefs

  const steps = [
    {
      src: kumikoSnap,
      alt: 'Kumiko Snap',
      title: 'She snaps a picture of her menu',
      description: 'Kumiko takes a picture of her menu and uploads it!',
    },
    {
      src: kumikoDeploy,
      alt: 'Kumiko Deploy',
      title: 'Builds her website',
      description: 'Build your website with just one press of a button and we fix the rest.',
    },
    {
      src: kumikoOrders,
      alt: 'Kumiko Orders',
      title: 'Orders Start Flowing',
      description: "Kumiko's customers discover her new digital menu and orders begin pouring in effortlessly.",
    },
    {
      src: kumikoServed,
      alt: 'Kumiko Served',
      title: 'Serving Happy Customers',
      description: 'Kumiko delivers amazing experiences, watching her customers smile as they enjoy their meals.',
    },
  ]

  // Set window width on client side
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])

  // Scroll handler for step tracking
  const handleScroll = useCallback(() => {
    // Check window width inside the function to avoid dependency issues
    if (window.innerWidth < 1024) return

    const viewportCenter = window.innerHeight / 2
    let closestIndex = 0
    let closestDistance = Infinity

    // Filter out images with zero height and calculate distances
    // Use desktopImageRefs directly since this only runs on desktop
    const imagesWithDimensions = desktopImageRefs.current
      .map((ref, index) => {
        if (!ref) return null
        const rect = ref.getBoundingClientRect()
        if (rect.height === 0) return null

        return {
          index,
          rect,
          imageCenter: rect.top + rect.height / 2,
        }
      })
      .filter(Boolean) as Array<{ index: number; rect: DOMRect; imageCenter: number }>

    if (imagesWithDimensions.length === 0) {
      return
    }

    imagesWithDimensions.forEach(({ index, rect, imageCenter }) => {
      const distance = Math.abs(imageCenter - viewportCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveStep(closestIndex)
  }, [])

  // Main animation setup effect
  useEffect(() => {
    if (!sectionRef.current || !descriptionRef.current || !titleRef.current) return

    // Clean up previous triggers
    scrollTriggerRefs.current.forEach(trigger => trigger.kill())
    scrollTriggerRefs.current = []

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(descriptionRef.current, { x: -50, opacity: 0 })
    gsap.set(desktopImageRefs.current, {
      opacity: 0,
      y: 100,
      scale: 0.8,
    })
    gsap.set(mobileImageRefs.current, {
      opacity: 0,
      y: 100,
      scale: 0.8,
    })

    // Create timeline for the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse',
      },
    })

    // Store the main timeline trigger
    if (tl.scrollTrigger) {
      scrollTriggerRefs.current.push(tl.scrollTrigger)
    }

    // Animate title first
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    })

    // Animate description box
    tl.to(
      descriptionRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    )

    // Animate images one by one as you scroll
    steps.forEach((_, index) => {
      const desktopRef = desktopImageRefs.current[index]
      const mobileRef = mobileImageRefs.current[index]

      if (desktopRef) {
        const imageTrigger = gsap.to(desktopRef, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: desktopRef,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })

        if (imageTrigger.scrollTrigger) {
          scrollTriggerRefs.current.push(imageTrigger.scrollTrigger)
        }
      }

      if (mobileRef) {
        const imageTrigger = gsap.to(mobileRef, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: mobileRef,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })

        if (imageTrigger.scrollTrigger) {
          scrollTriggerRefs.current.push(imageTrigger.scrollTrigger)
        }
      }
    })

    // Set up scroll listener for step tracking (desktop only)
    if (window.innerWidth >= 1024) {
      let ticking = false
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('scroll', throttledScroll)
      scrollListenerRef.current = () => window.removeEventListener('scroll', throttledScroll)

      // Initial call - wait longer for images to load
      setTimeout(handleScroll, 1000)
    }

    // Cleanup function
    return () => {
      scrollTriggerRefs.current.forEach(trigger => trigger.kill())
      scrollTriggerRefs.current = []
      if (scrollListenerRef.current) {
        scrollListenerRef.current()
        scrollListenerRef.current = null
      }
    }
  }, [handleScroll])

  // Animate text content when activeStep changes (desktop only)
  useEffect(() => {
    // Only run animations on desktop where we have the dynamic text box
    if (windowWidth < 1024) return
    if (!stepTitleRef.current || !stepDescriptionRef.current || !stepNumberRef.current) return

    // Create a timeline for the text animation
    const tl = gsap.timeline()

    // First fade out current content
    tl.to([stepTitleRef.current, stepDescriptionRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.15,
      ease: 'power2.out',
    })
      // Then fade in new content
      .to([stepTitleRef.current, stepDescriptionRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
      // Animate step number with a subtle bounce
      .to(
        stepNumberRef.current,
        {
          scale: 1.1,
          duration: 0.2,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .to(
        stepNumberRef.current,
        {
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.7)',
        },
        '-=0.1'
      )
  }, [activeStep, windowWidth])

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className={`text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16 ${bebasNeue.className}`}
        >
          Follow Kumiko's Journey
        </h2>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-2 gap-8 items-start">
          {/* Dynamic Description Box */}
          <div ref={descriptionRef} className="sticky top-20">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col min-h-[400px]">
              {/* Dynamic content based on active step */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-6 mb-6">
                  <div
                    ref={stepNumberRef}
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl"
                  >
                    {activeStep + 1}
                  </div>
                  <h4 ref={stepTitleRef} className={`text-2xl font-bold text-gray-800 ${bebasNeue.className}`}>
                    {steps[activeStep].title}
                  </h4>
                </div>
                <p ref={stepDescriptionRef} className="text-gray-600 leading-relaxed text-lg">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                ref={el => {
                  desktopImageRefs.current[index] = el
                }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={step.src}
                    alt={step.alt}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    priority={index < 2}
                  />
                  {/* Overlay with step info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">{step.title}</h4>
                      <p className="text-sm opacity-90">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={el => {
                mobileImageRefs.current[index] = el
              }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg mb-4">
                <Image
                  src={step.src}
                  alt={step.alt}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  priority={index < 2}
                />
              </div>

              {/* Mobile Text Box */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h4 className={`text-xl font-bold text-gray-800 ${bebasNeue.className}`}>{step.title}</h4>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
