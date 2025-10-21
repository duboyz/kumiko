'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface FeaturesSectionProps {}

// Features data configuration
const features = [
  {
    id: 1,
    title: 'Beautiful Website',
    description: 'Get a fresh, professional website that looks great and works perfectly.',
    icon: 'WebsiteIcon', // Replace with your icon component
  },
  {
    id: 2,
    title: 'Online Ordering',
    description: 'Customers can place orders directly from your digital menu.',
    icon: 'OrderingIcon', // Replace with your icon component
  },
  {
    id: 3,
    title: 'Mobile Ready',
    description: 'Your menu looks perfect on any device - phone, tablet, or desktop.',
    icon: 'MobileIcon', // Replace with your icon component
  },
  {
    id: 4,
    title: 'Easy Updates',
    description: 'Change prices and add new items instantly without technical skills.',
    icon: 'UpdatesIcon', // Replace with your icon component
  },
] as const

export function FeaturesSection({}: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !featuresRef.current) return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(subtitleRef.current, { y: 30, opacity: 0 })
    gsap.set(featureRefs.current, { y: 60, opacity: 0, scale: 0.9 })

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

    // Subtitle animation
    gsap.to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: subtitleRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    // Features grid animation
    gsap.to(featureRefs.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.15,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })

    // Hover animations for individual features
    featureRefs.current.forEach((featureRef, index) => {
      if (!featureRef) return

      const hoverTl = gsap.timeline({ paused: true })
      hoverTl.to(featureRef, {
        y: -10,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      })

      featureRef.addEventListener('mouseenter', () => hoverTl.play())
      featureRef.addEventListener('mouseleave', () => hoverTl.reverse())
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div id="features" ref={sectionRef} className={`py-24 px-8 bg-white ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-black mb-6">
            Everything You Need
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get a complete digital solution for your restaurant in minutes.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={el => {
                featureRefs.current[index] = el
              }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200"
            >
              {/* Icon placeholder - replace with your icon component */}
              <div className="w-16 h-16 bg-gray-100 rounded-xl mb-6 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                <span className="text-gray-400 text-sm font-medium">{feature.icon}</span>
              </div>

              <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-gray-800 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
