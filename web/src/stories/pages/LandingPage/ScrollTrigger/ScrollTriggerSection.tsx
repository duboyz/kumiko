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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    })

    // Initial state
    gsap.set([iconRef.current, titleRef.current, descRef.current, featuresRef.current], {
      opacity: 0,
      y: 50,
    })

    gsap.set(cardRef.current, {
      scale: 0.9,
      opacity: 0,
    })

    // Animation sequence
    tl.to(cardRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: delay * 0.2,
    })
      .to(
        iconRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        descRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .to(
        featuresRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.1'
      )

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    cardRef.current.addEventListener('mouseenter', handleMouseEnter)
    cardRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cardRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        borderColor: `${color}20`,
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
      />

      {/* Icon */}
      <div
        ref={iconRef}
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          boxShadow: `0 10px 30px ${color}30`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        ref={titleRef}
        className="text-2xl font-bold text-gray-800 mb-4"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p ref={descRef} className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features list */}
      <ul ref={featuresRef} className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: color }} />
            {feature}
          </li>
        ))}
      </ul>

      {/* Hover effect overlay */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}08, transparent)`,
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

    // Title animation
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Subtitle animation
    gsap.fromTo(
      subtitleRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  const features = [
    {
      icon: '🍽️',
      title: 'Restaurant Management',
      description: 'Complete restaurant management system with menu creation, order tracking, and customer insights.',
      features: [
        'Digital menu creation & management',
        'Real-time order tracking',
        'Customer analytics & insights',
        'Multi-location support',
        'QR code ordering system',
      ],
      color: '#3B82F6',
      delay: 0,
    },
    {
      icon: '🏨',
      title: 'Hospitality Solutions',
      description: 'Comprehensive hospitality management for hotels, resorts, and accommodation providers.',
      features: [
        'Room & booking management',
        'Guest experience optimization',
        'Revenue management tools',
        'Staff coordination systems',
        'Guest communication platform',
      ],
      color: '#10B981',
      delay: 1,
    },
    {
      icon: '🌐',
      title: 'Website Builder',
      description: 'Create stunning, responsive websites for your business with our intuitive drag-and-drop builder.',
      features: [
        'Drag-and-drop website builder',
        'Mobile-responsive templates',
        'SEO optimization tools',
        'Custom domain integration',
        'Analytics & performance tracking',
      ],
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
            className="text-6xl font-bold text-gray-800 mb-6"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
            }}
          >
            Everything You Need
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kumiko provides a complete suite of tools to manage your restaurant, hospitality business, and online
            presence. From menu management to website creation, we've got you covered.
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
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
              🚀
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">Ready to get started?</h3>
              <p className="text-sm text-gray-600">Join thousands of businesses already using Kumiko</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
