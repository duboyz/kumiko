'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  features: string[]
  color: string
  delay: number
}

const FeatureCard = ({ icon, title, description, features, color, delay }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!cardRef.current || !iconRef.current || !titleRef.current || !descRef.current || !featuresRef.current) return

    // Initial state with more dramatic positioning
    gsap.set([iconRef.current, titleRef.current, descRef.current, featuresRef.current], {
      opacity: 0,
      y: 80,
      rotationX: 15,
    })

    gsap.set(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      rotationY: 10,
      transformOrigin: 'center center',
    })

    // Create timeline that will be controlled by scroll
    const tl = gsap.timeline({ paused: true })

    // More sophisticated animation sequence
    tl.to(cardRef.current, {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
      .to(
        iconRef.current,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.8'
      )
      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6'
      )
      .to(
        descRef.current,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .to(
        featuresRef.current,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.2'
      )

    // ScrollTrigger that controls the timeline based on scroll position
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1, // This makes it tied to scroll position
      animation: tl,
      onUpdate: self => {
        // Add a slight delay based on the card's delay prop
        const progress = Math.max(0, self.progress - delay * 0.1)
        tl.progress(progress)
      },
    })

    // Enhanced hover animation
    const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
        y: -8,
        scale: 1.03,
        rotationY: 2,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    cardRef.current.addEventListener('mouseenter', handleMouseEnter)
    cardRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cardRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === cardRef.current) {
          trigger.kill()
        }
      })
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}08, ${color}03)`,
        borderColor: `${color}15`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ background: `radial-gradient(circle at 30% 20%, ${color}, transparent 50%)` }}
      />

      {/* Icon */}
      <div
        ref={iconRef}
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 relative z-10"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}DD)`,
          boxShadow: `0 8px 25px ${color}25`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        ref={titleRef}
        className="text-xl font-bold text-gray-800 mb-3 relative z-10"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p ref={descRef} className="text-gray-600 mb-6 leading-relaxed text-sm relative z-10">
        {description}
      </p>

      {/* Features list */}
      <ul ref={featuresRef} className="space-y-3 relative z-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-xs text-gray-700 font-medium">
            <div className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: color }} />
            {feature}
          </li>
        ))}
      </ul>

      {/* Elegant hover effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}06, transparent)`,
        }}
      />
    </div>
  )
}

export const ScrollTriggerSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    // Set initial states with more sophisticated positioning
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 120,
      scale: 0.8,
      rotationX: 20,
    })

    gsap.set(subtitleRef.current, {
      opacity: 0,
      y: 60,
      scale: 0.9,
    })

    // Create scroll-controlled timeline for header
    const headerTl = gsap.timeline({ paused: true })

    headerTl
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.4,
        ease: 'power3.out',
      })
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.8'
      )

    // ScrollTrigger for header animations
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      animation: headerTl,
    })

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  const features = [
    {
      icon: '🍽️',
      title: 'Restaurant',
      description: 'Complete management system for modern dining.',
      features: ['Menu Management', 'Order Tracking', 'Analytics'],
      color: '#3B82F6',
      delay: 0,
    },
    {
      icon: '🏨',
      title: 'Hospitality',
      description: 'Streamlined solutions for accommodation providers.',
      features: ['Booking Management', 'Guest Experience', 'Revenue Tools'],
      color: '#10B981',
      delay: 1,
    },
    {
      icon: '🌐',
      title: 'Websites',
      description: 'Beautiful, responsive websites made simple.',
      features: ['Drag & Drop Builder', 'Mobile Ready', 'SEO Optimized'],
      color: '#8B5CF6',
      delay: 2,
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200 rounded-full opacity-15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-5xl font-bold text-gray-800 mb-6"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
            }}
          >
            Built for Business
          </h2>
          <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to manage, grow, and showcase your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              features={feature.features}
              color={feature.color}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-6 bg-white rounded-xl px-8 py-4 shadow-lg border border-gray-100">
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-800">Ready to get started?</h3>
              <p className="text-xs text-gray-600">Join businesses using Kumiko</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
