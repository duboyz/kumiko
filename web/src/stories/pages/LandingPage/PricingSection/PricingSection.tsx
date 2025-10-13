'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface PricingSectionProps {}

// Pricing data configuration
const pricingTiers = [
  {
    id: 1,
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for small restaurants getting started',
    features: [
      'Digital menu creation',
      'Basic online ordering',
      'Mobile responsive design',
      'Email support',
      'Up to 50 menu items',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 2,
    name: 'Professional',
    price: '$29',
    period: 'per month',
    description: 'Everything you need to grow your business',
    features: [
      'Everything in Starter',
      'Advanced online ordering',
      'Reservation system',
      'Analytics dashboard',
      'Priority support',
      'Unlimited menu items',
      'Custom branding',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large restaurants with special needs',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Dedicated account manager',
      'White-label solution',
      'Advanced analytics',
      'API access',
      'Custom development',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
] as const

export function PricingSection({}: PricingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const pricingCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !pricingRef.current) return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(subtitleRef.current, { y: 30, opacity: 0 })
    gsap.set(pricingCardRefs.current, { y: 100, opacity: 0, scale: 0.8 })

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

    // Pricing cards animation
    gsap.to(pricingCardRefs.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.7)',
      stagger: 0.2,
      scrollTrigger: {
        trigger: pricingRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })

    // Hover animations for pricing cards
    pricingCardRefs.current.forEach((cardRef, index) => {
      if (!cardRef) return

      const hoverTl = gsap.timeline({ paused: true })
      hoverTl.to(cardRef, {
        y: -20,
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      })

      cardRef.addEventListener('mouseenter', () => hoverTl.play())
      cardRef.addEventListener('mouseleave', () => hoverTl.reverse())
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-blue-50 to-white ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your restaurant. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div ref={pricingRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.id}
              ref={el => {
                pricingCardRefs.current[index] = el
              }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                tier.popular ? 'border-black ring-2 ring-gray-200' : 'border-gray-100 hover:border-black'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">Most Popular</span>
                </div>
              )}

              {/* Plan Name */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{tier.name}</h3>
                <p className="text-gray-600 text-sm">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-gray-800 mb-1">{tier.price}</div>
                <div className="text-gray-600 text-sm">{tier.period}</div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-black text-white hover:bg-black hover:scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-bold text-gray-800 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time with no penalties.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-gray-800 mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600 text-sm">No setup fees. You only pay for your chosen plan.</p>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-gray-800 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-gray-800 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept all major credit cards and PayPal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
