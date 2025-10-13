'use client'

import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface FAQProps {}

export function FAQ({}: FAQProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<number[]>([])

  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial states
    gsap.set([heroRef.current, contentRef.current], {
      y: 50,
      opacity: 0,
    })

    // Animate sections on scroll
    const sections = [heroRef.current, contentRef.current]

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

  const categories = [
    { id: 'all', name: 'All Questions', icon: '❓' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'pricing', name: 'Pricing & Billing', icon: '💳' },
    { id: 'features', name: 'Features', icon: '⭐' },
    { id: 'technical', name: 'Technical', icon: '🔧' },
    { id: 'support', name: 'Support', icon: '💬' },
  ]

  const faqs = [
    {
      id: 1,
      question: 'How quickly can I get my restaurant digitized?',
      answer:
        'Most restaurants are up and running within 30 minutes. Our AI processes your menu instantly, and you can start taking orders immediately. The setup process is designed to be as simple as possible - just upload your menu photo and we handle the rest.',
      category: 'getting-started',
      popular: true,
    },
    {
      id: 2,
      question: 'Is there really a free plan?',
      answer:
        'Yes! Our Starter plan is completely free forever. You get digital menu creation, basic online ordering, and email support. No credit card required, no hidden fees, no time limits. We believe small restaurants should have access to digital tools without breaking the bank.',
      category: 'pricing',
      popular: true,
    },
    {
      id: 3,
      question: 'Do you offer custom integrations?',
      answer:
        'Yes! We integrate with popular POS systems, payment processors, and delivery platforms. For Enterprise customers, we offer custom integrations and API access. Contact our sales team to discuss your specific integration needs.',
      category: 'features',
      popular: false,
    },
    {
      id: 4,
      question: 'What kind of support do you provide?',
      answer:
        'We offer different levels of support based on your plan: Starter gets email support, Professional gets priority email support, and Enterprise gets 24/7 phone support plus a dedicated account manager. All plans include comprehensive documentation and help articles.',
      category: 'support',
      popular: true,
    },
    {
      id: 5,
      question: 'Can I try Kumiko before committing?',
      answer:
        'Absolutely! You can start with our free plan and upgrade anytime. No credit card required for the free plan, and you can cancel paid plans anytime with no penalties. We also offer a 30-day money-back guarantee on all paid plans.',
      category: 'pricing',
      popular: false,
    },
    {
      id: 6,
      question: 'How does the menu digitization work?',
      answer:
        "Simply take a photo of your menu and upload it to Kumiko. Our AI will automatically extract menu items, prices, and descriptions. You can then review, edit, and customize everything before going live. It's designed to be as simple as taking a picture.",
      category: 'features',
      popular: true,
    },
    {
      id: 7,
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards and PayPal. All payments are processed securely through Stripe, so your payment information is never stored on our servers. We also offer annual billing with a 20% discount.',
      category: 'pricing',
      popular: false,
    },
    {
      id: 8,
      question: 'Can I customize my restaurant website?',
      answer:
        'Yes! You can customize colors, fonts, layout, and add your own branding. Professional and Enterprise plans include advanced customization options. We also provide templates to get you started quickly.',
      category: 'features',
      popular: false,
    },
    {
      id: 9,
      question: 'How do I manage customer orders?',
      answer:
        'Orders appear in your Kumiko dashboard in real-time. You can view order details, mark orders as completed, and communicate with customers. The system also sends automatic notifications to keep you updated.',
      category: 'features',
      popular: false,
    },
    {
      id: 10,
      question: 'Is my data secure?',
      answer:
        "Absolutely. We use industry-standard encryption for all data in transit and at rest. We're SOC 2 compliant and regularly audit our security practices. Your data is never sold to third parties, and we only collect what we need to provide our service.",
      category: 'technical',
      popular: true,
    },
    {
      id: 11,
      question: 'Can I cancel my subscription anytime?',
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or penalties. You'll continue to have access to paid features until the end of your billing period.",
      category: 'pricing',
      popular: false,
    },
    {
      id: 12,
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with our service, contact us within 30 days of your payment and we'll provide a full refund, no questions asked.",
      category: 'pricing',
      popular: false,
    },
    {
      id: 13,
      question: 'How do I get started?',
      answer:
        'Getting started is easy: 1) Sign up for a free account, 2) Upload a photo of your menu, 3) Review and customize your digital menu, 4) Set up payment processing, 5) Go live! Our setup wizard guides you through each step.',
      category: 'getting-started',
      popular: true,
    },
    {
      id: 14,
      question: 'What if I need help during setup?',
      answer:
        "We're here to help! You can contact our support team via email, and we typically respond within 2 hours. We also have comprehensive help articles and video tutorials to guide you through the setup process.",
      category: 'support',
      popular: false,
    },
    {
      id: 15,
      question: 'Can I use Kumiko for multiple restaurant locations?',
      answer:
        'Yes! Professional and Enterprise plans support multiple locations. You can manage all your restaurants from a single dashboard, with location-specific menus, orders, and analytics.',
      category: 'features',
      popular: false,
    },
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularFAQs = faqs.filter(faq => faq.popular)

  const toggleItem = (id: number) => {
    setOpenItems(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      {/* Hero Section */}
      <div ref={heroRef} className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Find answers to common questions about Kumiko. Can't find what you're looking for? Contact our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-gray-400 rounded-xl"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Popular FAQs */}
          {searchQuery === '' && selectedCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Most Popular Questions</h2>
              <div className="space-y-4">
                {popularFAQs.map(faq => (
                  <Card key={faq.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full text-left flex items-center justify-between"
                      >
                        <h3 className="text-lg font-bold text-gray-800 pr-4">{faq.question}</h3>
                        <span className="text-2xl text-gray-400">{openItems.includes(faq.id) ? '−' : '+'}</span>
                      </button>
                      {openItems.includes(faq.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* All FAQs */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>

            {filteredFAQs.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No questions found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <Card key={faq.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full text-left flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-bold text-gray-800 pr-4">{faq.question}</h3>
                          {faq.popular && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <span className="text-2xl text-gray-400">{openItems.includes(faq.id) ? '−' : '+'}</span>
                      </button>
                      {openItems.includes(faq.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-16">
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our support team is here to help you get the most out of
                  Kumiko.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/help"
                    className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    Help Center
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using Kumiko to digitize their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Start Free Trial
            </a>
            <a
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
