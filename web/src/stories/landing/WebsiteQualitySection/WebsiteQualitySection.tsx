'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface WebsiteQualitySectionProps {}

export function WebsiteQualitySection({}: WebsiteQualitySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const websiteFeatures = [
    {
      title: 'Fresh & Modern Design',
      description: 'Clean, professional look that builds trust with customers',
      icon: '✨',
      benefit: 'Higher conversion rates',
    },
    {
      title: 'Mobile Optimized',
      description: 'Perfect on phones, tablets, and desktops',
      icon: '📱',
      benefit: 'More mobile orders',
    },
    {
      title: 'Fast Loading',
      description: 'Lightning-fast website that keeps customers engaged',
      icon: '⚡',
      benefit: 'Better user experience',
    },
    {
      title: 'Easy Navigation',
      description: 'Simple menu browsing and ordering process',
      icon: '🧭',
      benefit: 'Higher order completion',
    },
    {
      title: 'SEO Optimized',
      description: 'Built to rank well in Google searches',
      icon: '🔍',
      benefit: 'More organic traffic',
    },
    {
      title: 'Ready to Order',
      description: 'Integrated ordering system works immediately',
      icon: '🛒',
      benefit: 'Start taking orders today',
    },
  ]

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !featuresRef.current || !ctaRef.current)
      return

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current], { y: 50, opacity: 0 })
    gsap.set(featuresRef.current, { y: 80, opacity: 0, scale: 0.95 })
    gsap.set(ctaRef.current, { y: 60, opacity: 0 })

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    // Animate elements
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    })
      .to(
        subtitleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .to(
        featuresRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      )
      .to(
        ctaRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.2'
      )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-white to-gray-50 ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Get a Beautiful Website That's Ready to Order
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            No ugly templates or complicated setup. You get a fresh, professional website that's optimized for food
            ordering and ready to start taking orders immediately.
          </p>
        </div>

        {/* Website Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {websiteFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3">{feature.description}</p>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-sm">
                  {feature.benefit}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div ref={ctaRef} className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Your Beautiful Website?</h3>
            <p className="text-lg text-gray-600 mb-6">
              Join hundreds of restaurants with professional websites that are ready to take orders immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Get My Website Now
              </a>
              <a
                href="/contact"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                See Live Examples
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
