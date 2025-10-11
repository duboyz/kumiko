'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface PricingPageProps {}

export function PricingPage({}: PricingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial states
    gsap.set([heroRef.current, pricingRef.current, faqRef.current, featuresRef.current], {
      y: 50,
      opacity: 0,
    })

    // Animate sections on scroll
    const sections = [heroRef.current, pricingRef.current, faqRef.current, featuresRef.current]

    sections.forEach(section => {
      if (section) {
        gsap.to(section, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

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
        'Basic analytics',
      ],
      cta: 'Get Started Free',
      popular: false,
      highlight: 'No credit card required',
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
        'Multi-location support',
      ],
      cta: 'Start Free Trial',
      popular: true,
      highlight: 'Most popular',
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
        '24/7 phone support',
      ],
      cta: 'Contact Sales',
      popular: false,
      highlight: 'Tailored solution',
    },
  ]

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer:
        'Yes, you can upgrade or downgrade your plan at any time with no penalties. Changes take effect immediately.',
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees, no hidden costs. You only pay for your chosen plan. What you see is what you pay.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your money.",
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and PayPal. All payments are processed securely through Stripe.',
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        'Absolutely. You can cancel your subscription at any time from your account settings. No questions asked.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save 20% when you pay annually. Contact us for custom enterprise pricing.',
    },
  ]

  const comparisonFeatures = [
    {
      feature: 'Digital Menu Creation',
      starter: true,
      professional: true,
      enterprise: true,
    },
    {
      feature: 'Online Ordering',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Advanced',
    },
    {
      feature: 'Menu Items',
      starter: 'Up to 50',
      professional: 'Unlimited',
      enterprise: 'Unlimited',
    },
    {
      feature: 'Reservation System',
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: 'Analytics Dashboard',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Advanced + Custom',
    },
    {
      feature: 'Custom Branding',
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: 'Support',
      starter: 'Email',
      professional: 'Priority Email',
      enterprise: '24/7 Phone + Dedicated Manager',
    },
    {
      feature: 'API Access',
      starter: false,
      professional: false,
      enterprise: true,
    },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      {/* Hero Section */}
      <div ref={heroRef} className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">Simple, Fair Pricing</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            No hidden fees, no surprise charges. Just honest pricing that makes sense for your restaurant. Start free
            and upgrade when you're ready to grow.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money-back guarantee</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div ref={pricingRef} className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card
                key={tier.id}
                className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  tier.popular ? 'ring-2 ring-gray-300 scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-black text-white px-4 py-2">{tier.highlight}</Badge>
                  </div>
                )}

                <CardContent className="p-8">
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
                  <Button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      tier.popular
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div ref={featuresRef} className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Compare Plans</h2>
            <p className="text-xl text-gray-600">See exactly what's included in each plan</p>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-800">Features</th>
                    <th className="text-center p-4 font-semibold text-gray-800">Starter</th>
                    <th className="text-center p-4 font-semibold text-gray-800">Professional</th>
                    <th className="text-center p-4 font-semibold text-gray-800">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-medium text-gray-800">{item.feature}</td>
                      <td className="p-4 text-center text-gray-600">
                        {typeof item.starter === 'boolean' ? (item.starter ? '✓' : '✗') : item.starter}
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {typeof item.professional === 'boolean' ? (item.professional ? '✓' : '✗') : item.professional}
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {typeof item.enterprise === 'boolean' ? (item.enterprise ? '✓' : '✗') : item.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using Kumiko. Start free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
