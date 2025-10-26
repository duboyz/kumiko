'use client'

import { useEffect, useRef, useState } from 'react'
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
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const descriptionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepTitleRef = useRef<HTMLHeadingElement>(null)
  const stepDescriptionRef = useRef<HTMLParagraphElement>(null)
  const stepNumberRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      src: kumikoSnap,
      alt: 'Kumiko Snap',
      title: "Kumiko's Menu Photo",
      description:
        "Meet Kumiko! She snaps a quick photo of her restaurant's menu - just one picture to start her digital journey.",
    },
    {
      src: kumikoDeploy,
      alt: 'Kumiko Deploy',
      title: 'Building Her Website',
      description:
        "Our AI works its magic, transforming Kumiko's menu into a beautiful, professional website in minutes.",
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

  useEffect(() => {
    if (!sectionRef.current || !descriptionRef.current || !titleRef.current) return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(descriptionRef.current, { x: -50, opacity: 0 })
    gsap.set(imageRefs.current, {
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
      if (imageRefs.current[index]) {
        gsap.to(imageRefs.current[index], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: imageRefs.current[index],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    })

    // Set up intersection observer to track which image is in view
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.findIndex(ref => ref === entry.target)
            if (index !== -1) {
              setActiveStep(index)
            }
          }
        })
      },
      {
        threshold: 0.5, // Trigger when 50% of the image is visible
        rootMargin: '-20% 0px -20% 0px', // Only trigger when image is in center area
      }
    )

    // Observe all images
    imageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      observer.disconnect()
    }
  }, [])

  // Animate text content when activeStep changes
  useEffect(() => {
    if (!stepTitleRef.current || !stepDescriptionRef.current || !stepNumberRef.current) return

    // Create a timeline for the text animation
    const tl = gsap.timeline()

    // Animate step number with a subtle bounce
    tl.to(stepNumberRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: 'power2.out',
    }).to(
      stepNumberRef.current,
      {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      },
      '-=0.1'
    )

    // Animate title and description with fade and slide
    tl.to([stepTitleRef.current, stepDescriptionRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: 'power2.out',
    }).to(
      [stepTitleRef.current, stepDescriptionRef.current],
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      },
      '-=0.1'
    )
  }, [activeStep])

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Dynamic Description Box */}
          <div ref={descriptionRef} className="lg:sticky lg:top-20">
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
                ref={el => {
                  imageRefs.current[index] = el
                }}
                className="relative group"
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
      </div>
    </section>
  )
}
