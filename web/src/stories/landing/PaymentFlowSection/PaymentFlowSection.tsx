'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface PaymentFlowSectionProps {}

export function PaymentFlowSection({}: PaymentFlowSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const kumikoCardRef = useRef<HTMLDivElement>(null)
  const competitorCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !sectionRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !cardsRef.current ||
      !kumikoCardRef.current ||
      !competitorCardRef.current
    )
      return

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current], { y: 50, opacity: 0 })
    gsap.set(cardsRef.current, { y: 80, opacity: 0, scale: 0.95 })
    gsap.set(kumikoCardRef.current, { x: -100, opacity: 0 })
    gsap.set(competitorCardRef.current, { x: 100, opacity: 0 })

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
        cardsRef.current,
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
        kumikoCardRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .to(
        competitorCardRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const steps = [
    { number: 1, text: 'Customer places order', icon: '📱' },
    { number: 2, text: 'You receive notification', icon: '🔔' },
    { number: 3, text: 'You prepare the food', icon: '👨‍🍳' },
    { number: 4, text: 'Customer picks up & pays', icon: '💳' },
  ]

  const competitorSteps = [
    { number: 1, text: 'Customer places order', icon: '📱' },
    { number: 2, text: 'Customer pays upfront', icon: '💳' },
    { number: 3, text: 'Platform takes 30% cut', icon: '💰' },
    { number: 4, text: 'You get remaining 70%', icon: '😞' },
  ]

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            How Payment Actually Works
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlike other platforms that take huge cuts upfront, we let your customers pay when they pick up their food.
            You get a beautiful, ready-to-use website that's optimized for food ordering, and you keep 100% of your
            revenue.
          </p>
        </div>

        {/* Payment Flow Comparison */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Kumiko Flow */}
          <div ref={kumikoCardRef} className="space-y-6">
            <div className="text-center">
              <Badge className="bg-gray-800 text-white px-4 py-2 text-lg font-semibold">Kumiko Way</Badge>
              <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2">You Keep 100%</h3>
              <p className="text-gray-600">Customers pay when they pick up</p>
            </div>

            <Card className="border-2 border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <CardHeader>
                <CardTitle className="text-white text-center">Payment Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-white">{step.text}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-white/10 rounded-lg text-center">
                  <div className="text-lg font-semibold text-white">Result: You keep 100% of revenue</div>
                  <div className="text-sm text-gray-200 mt-1">Plus our low monthly fee</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitor Flow */}
          <div ref={competitorCardRef} className="space-y-6">
            <div className="text-center">
              <Badge variant="outline" className="border-gray-300 text-gray-700 px-4 py-2 text-lg font-semibold">
                Other Platforms
              </Badge>
              <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2">You Lose 30%</h3>
              <p className="text-gray-600">Customers pay upfront, platform takes cut</p>
            </div>

            <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="text-gray-800 text-center">Payment Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {competitorSteps.map((step, index) => (
                  <div key={step.number} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <div className="text-lg font-semibold text-red-800">Result: You lose 30% of every order</div>
                  <div className="text-sm text-red-600 mt-1">Plus additional fees</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Pay 30% When You Can Pay $29.99?</h3>
            <p className="text-lg text-gray-600 mb-6">
              On a $10,000 monthly revenue, competitors take $3,000. We charge $29.99. That's $2,970 more in your pocket
              every month. Plus, we never take a percentage of your transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Keeping 100%
              </a>
              <a
                href="/contact"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
