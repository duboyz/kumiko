'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface TermsOfServiceProps {}

export function TermsOfService({}: TermsOfServiceProps) {
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

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      {/* Hero Section */}
      <div ref={heroRef} className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Simple, fair terms for using Kumiko. No legal jargon, just clear expectations.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  By using Kumiko, you agree to these terms. We've tried to keep them simple and fair. If you have
                  questions, just ask us.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  These terms apply to all users of our restaurant digitization platform. We reserve the right to update
                  these terms, but we'll notify you of any significant changes.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Provide</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Kumiko provides digital menu creation, online ordering, and website services for restaurants. We help
                  you digitize your business and connect with customers online.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Digital menu creation and management</li>
                  <li>Online ordering system</li>
                  <li>Restaurant website creation</li>
                  <li>Payment processing integration</li>
                  <li>Customer support and technical assistance</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Responsibilities</h2>
                <p className="text-gray-600 leading-relaxed mb-4">To use our service, you agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide accurate information about your restaurant</li>
                  <li>Keep your account information up to date</li>
                  <li>Use the service in compliance with local laws and regulations</li>
                  <li>Not use the service for illegal or harmful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Pay fees on time if you're on a paid plan</li>
                </ul>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">Fair and transparent pricing:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Free plan: No charges, no credit card required</li>
                  <li>Paid plans: Billed monthly or annually</li>
                  <li>All fees are clearly displayed before you sign up</li>
                  <li>You can cancel anytime with no penalties</li>
                  <li>Refunds available within 30 days of payment</li>
                  <li>We use Stripe for secure payment processing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed mb-4">We respect your content and you respect ours:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You own your restaurant content (menus, photos, etc.)</li>
                  <li>We own the Kumiko platform and technology</li>
                  <li>You grant us permission to use your content to provide our service</li>
                  <li>Don't copy or misuse our platform or technology</li>
                  <li>Don't upload content that infringes on others' rights</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Privacy and Data</h2>
                <p className="text-gray-600 leading-relaxed mb-4">We take your privacy seriously:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We collect only what we need to provide our service</li>
                  <li>We don't sell your data to third parties</li>
                  <li>We protect your data with industry-standard security</li>
                  <li>You can request access to or deletion of your data</li>
                  <li>See our Privacy Policy for full details</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Service Availability</h2>
                <p className="text-gray-600 leading-relaxed mb-4">We strive to keep Kumiko running smoothly:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We aim for 99.9% uptime but can't guarantee 100%</li>
                  <li>We may perform maintenance that temporarily affects service</li>
                  <li>We'll notify you of planned maintenance when possible</li>
                  <li>We're not liable for downtime beyond our control</li>
                </ul>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Termination</h2>
                <p className="text-gray-600 leading-relaxed mb-4">Either party can end this agreement:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You can cancel your account anytime</li>
                  <li>We can suspend accounts that violate these terms</li>
                  <li>We'll provide notice before terminating paid accounts</li>
                  <li>You can export your data before cancellation</li>
                  <li>Some provisions survive termination (like payment obligations)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We provide our service "as is" and limit our liability:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We're not liable for indirect or consequential damages</li>
                  <li>Our total liability is limited to what you paid us in the last 12 months</li>
                  <li>We're not responsible for third-party services we integrate with</li>
                  <li>You use our service at your own risk</li>
                </ul>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">We may update these terms occasionally:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We'll notify you of significant changes</li>
                  <li>Continued use after changes means you accept them</li>
                  <li>You can cancel if you don't agree with changes</li>
                  <li>We'll post the current terms on our website</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Questions?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have questions about these terms, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:legal@kumiko.com" className="text-gray-800 hover:underline">
                      legal@kumiko.com
                    </a>
                  </p>
                  <p>
                    <strong>General Contact:</strong>{' '}
                    <a href="/contact" className="text-gray-800 hover:underline">
                      Contact Us
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Questions About Our Terms?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're here to help. Contact us if you have any questions about our terms of service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
