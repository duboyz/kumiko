'use client'

import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface ContactPageProps {}

export function ContactPage({}: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial states
    gsap.set([heroRef.current, formRef.current, infoRef.current, faqRef.current], {
      y: 50,
      opacity: 0,
    })

    // Animate sections on scroll
    const sections = [heroRef.current, formRef.current, infoRef.current, faqRef.current]

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitStatus('success')

    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: '',
      })
      setSubmitStatus('idle')
    }, 3000)
  }

  const contactInfo = [
    {
      title: 'Email Support',
      description: 'Get help with your account or technical issues',
      contact: 'support@kumiko.com',
      icon: '📧',
      badge: 'Response within 2 hours',
    },
    {
      title: 'Sales Inquiries',
      description: 'Questions about pricing or enterprise plans',
      contact: 'sales@kumiko.com',
      icon: '💼',
      badge: 'Response within 1 hour',
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+1 (555) 123-4567',
      icon: '📞',
      badge: 'Mon-Fri 9AM-6PM PST',
    },
    {
      title: 'Office Address',
      description: 'Visit our headquarters',
      contact: '123 Business Street, Suite 100, City, State 12345',
      icon: '📍',
      badge: 'By appointment only',
    },
  ]

  const faqs = [
    {
      question: 'How quickly can I get my restaurant digitized?',
      answer:
        'Most restaurants are up and running within 30 minutes. Our AI processes your menu instantly, and you can start taking orders immediately.',
    },
    {
      question: 'Do you offer custom integrations?',
      answer:
        'Yes! We integrate with popular POS systems, payment processors, and delivery platforms. Contact our sales team for custom integration needs.',
    },
    {
      question: 'What kind of support do you provide?',
      answer:
        'We offer 24/7 email support, phone support during business hours, and comprehensive documentation. Enterprise customers get dedicated account managers.',
    },
    {
      question: 'Can I try Kumiko before committing?',
      answer:
        'Absolutely! We offer a free plan with no credit card required. You can upgrade anytime as your business grows.',
    },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      {/* Hero Section */}
      <div ref={heroRef} className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Have questions about Kumiko? Need help getting started? We're here to help you succeed. Reach out to our
            team and we'll get back to you quickly.
          </p>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div ref={formRef}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">Thank you! We'll get back to you soon.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                          Restaurant/Company
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Your restaurant name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inquiryType" className="text-sm font-medium text-gray-700">
                          Inquiry Type
                        </Label>
                        <Select value={formData.inquiryType} onValueChange={handleSelectChange}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales Inquiry</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Brief subject line"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-1 min-h-[120px]"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Other Ways to Reach Us</h2>

              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
                        <p className="text-gray-600 mb-3">{info.description}</p>
                        <p className="text-gray-800 font-medium mb-2">{info.contact}</p>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                          {info.badge}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Quick Links */}
              <Card className="border-0 shadow-lg bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a
                      href="/register"
                      className="block text-gray-800 hover:text-black font-medium transition-colors duration-300"
                    >
                      → Get Started Free
                    </a>
                    <a
                      href="/about"
                      className="block text-gray-800 hover:text-black font-medium transition-colors duration-300"
                    >
                      → Learn About Us
                    </a>
                    <a
                      href="#"
                      className="block text-gray-800 hover:text-black font-medium transition-colors duration-300"
                    >
                      → View Documentation
                    </a>
                    <a
                      href="#"
                      className="block text-gray-800 hover:text-black font-medium transition-colors duration-300"
                    >
                      → Check Status Page
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="py-16 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions about Kumiko</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
