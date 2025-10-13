'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface SavingsCalculatorProps {}

export function SavingsCalculator({}: SavingsCalculatorProps) {
  const [monthlyRevenue, setMonthlyRevenue] = useState(5000)
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const calculatorRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Calculate costs
  const competitorFee = Math.round(monthlyRevenue * 0.3) // 30% cut
  const kumikoFee = 30 // Starting at $29.99 USD
  const savings = competitorFee - kumikoFee
  const savingsPercentage = Math.round((savings / competitorFee) * 100)

  useEffect(() => {
    if (
      !sectionRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !calculatorRef.current ||
      !sliderRef.current
    )
      return

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current], { y: 50, opacity: 0 })
    gsap.set(calculatorRef.current, { y: 80, opacity: 0, scale: 0.95 })

    // Create timeline for initial entrance
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
        calculatorRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      )

    // Create scroll-triggered slider animation
    const sliderAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: sliderRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: self => {
          // Animate revenue from 5k to 20k as user scrolls
          const progress = self.progress
          const minRevenue = 5000
          const maxRevenue = 20000
          const newRevenue = Math.round(minRevenue + (maxRevenue - minRevenue) * progress)
          setMonthlyRevenue(newRevenue)
        },
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('nb-NO').format(amount)
  }

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-white to-gray-50 ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            See How Much You'll Save
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Compare our fair pricing with competitors who take massive cuts from your hard-earned revenue.
          </p>
        </div>

        {/* Calculator */}
        <div ref={calculatorRef} className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-4">Monthly Revenue Calculator</CardTitle>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(monthlyRevenue)}</div>
                  <div className="text-sm text-gray-600">Your estimated monthly revenue</div>
                </div>
                <div ref={sliderRef} className="px-8">
                  <Slider
                    value={[monthlyRevenue]}
                    onValueChange={value => setMonthlyRevenue(value[0])}
                    min={1000}
                    max={50000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{formatCurrency(1000)}</span>
                    <span>{formatCurrency(50000)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Competitor Card */}
                <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-800">Other Platforms</CardTitle>
                      <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50">
                        30% Fee
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 mb-1">{formatCurrency(competitorFee)}</div>
                        <div className="text-sm text-gray-600">Monthly platform fee</div>
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        That's {formatCurrency(competitorFee * 12)} per year!
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Kumiko Card */}
                <Card className="border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-white">Kumiko</CardTitle>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Starting at $29.99
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{formatCurrency(kumikoFee)}</div>
                        <div className="text-sm text-gray-200">Starting monthly fee</div>
                      </div>
                      <div className="text-center text-sm text-gray-300">
                        That's {formatCurrency(kumikoFee * 12)} per year!
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Savings Highlight */}
              <div className="mt-8 text-center">
                <Card className="border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="py-8">
                    <div className="text-lg font-semibold text-gray-700 mb-2">You Save</div>
                    <div className="text-5xl font-bold text-gray-800 mb-3">{formatCurrency(savings)}</div>
                    <div className="text-lg text-gray-600 mb-2">
                      per month ({savingsPercentage}% less than competitors)
                    </div>
                    <div className="text-sm text-gray-500">That's {formatCurrency(savings * 12)} saved per year!</div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <div className="mt-8 text-center">
                <div className="text-lg text-gray-600 mb-6">Ready to start saving money on platform fees?</div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/register"
                    className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Free
                  </a>
                  <a
                    href="/contact"
                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
