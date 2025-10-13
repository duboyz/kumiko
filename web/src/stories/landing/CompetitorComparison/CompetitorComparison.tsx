'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface CompetitorComparisonProps {}

export function CompetitorComparison({}: CompetitorComparisonProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      feature: 'Setup Time',
      kumiko: '15 minutes',
      competitors: '2-4 weeks',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Monthly Fee',
      kumiko: '$29.99 starting',
      competitors: '30% of revenue',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Payment Method',
      kumiko: 'Pay on pickup',
      competitors: 'Pay upfront',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Technical Skills Required',
      kumiko: 'None',
      competitors: 'Basic to advanced',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Menu Upload',
      kumiko: 'Take 1 photo',
      competitors: 'Manual entry',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Customer Support',
      kumiko: 'Personal support',
      competitors: 'Ticket system',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Contract Length',
      kumiko: 'Month-to-month',
      competitors: 'Annual contracts',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
    {
      feature: 'Setup Fees',
      kumiko: 'Free',
      competitors: '$50-200',
      kumikoIcon: <Check className="h-5 w-5 text-green-600" />,
      competitorIcon: <X className="h-5 w-5 text-red-500" />,
    },
  ]

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !tableRef.current) return

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current], { y: 50, opacity: 0 })
    gsap.set(tableRef.current, { y: 80, opacity: 0, scale: 0.95 })

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
        tableRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Why Choose Kumiko?
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how Kumiko compares to other restaurant platform solutions. The choice is clear.
          </p>
        </div>

        {/* Comparison Table */}
        <div ref={tableRef}>
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="text-lg font-semibold text-gray-800">Feature</div>
                <div className="text-center">
                  <Badge className="bg-gray-800 text-white px-4 py-2 text-lg font-semibold">Kumiko</Badge>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="border-gray-300 text-gray-700 px-4 py-2 text-lg font-semibold">
                    Other Platforms
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-6 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } border-b border-gray-100 last:border-b-0`}
                >
                  <div className="font-semibold text-gray-800 flex items-center">{feature.feature}</div>
                  <div className="text-center flex items-center justify-center space-x-2">
                    {feature.kumikoIcon}
                    <span className="text-gray-800 font-medium">{feature.kumiko}</span>
                  </div>
                  <div className="text-center flex items-center justify-center space-x-2">
                    {feature.competitorIcon}
                    <span className="text-gray-600">{feature.competitors}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Summary */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">The Math is Simple</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">Other Platforms</div>
                <div className="text-lg text-gray-600">30% of revenue + setup fees + long contracts</div>
                <div className="text-sm text-gray-500 mt-2">On $10k revenue = $3k + fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">Kumiko</div>
                <div className="text-lg text-gray-600">$29.99 starting monthly fee</div>
                <div className="text-sm text-gray-500 mt-2">On $10k revenue = $29.99</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-4">You save $2,970 per month on $10k revenue</div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Saving Today
                </a>
                <a
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Calculate Your Savings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
