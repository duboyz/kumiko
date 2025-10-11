'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface PrivacyPolicyProps {}

export function PrivacyPolicy({}: PrivacyPolicyProps) {
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We believe in transparency. Here's how we collect, use, and protect your data.
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  At Kumiko, we're committed to protecting your privacy. This Privacy Policy explains how we collect,
                  use, and safeguard your information when you use our restaurant digitization platform.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe in being transparent about our data practices. We don't sell your data, we don't track you
                  across the web, and we only collect what we need to provide you with our service.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Information</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Name and email address when you create an account</li>
                  <li>Restaurant name and contact information</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Menu and Business Data</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Menu items, prices, and descriptions you upload</li>
                  <li>Restaurant photos and branding materials</li>
                  <li>Order and transaction data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>How you use our platform (pages visited, features used)</li>
                  <li>Device and browser information for technical support</li>
                  <li>IP address and general location (country/region level)</li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use your information only to provide and improve our service:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Create and manage your digital menu and website</li>
                  <li>Process orders and payments</li>
                  <li>Provide customer support</li>
                  <li>Send important service updates (not marketing spam)</li>
                  <li>Improve our platform based on usage patterns</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Data Sharing</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We don't sell your data. Period. We only share information in these limited circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    <strong>Payment Processing:</strong> With Stripe to process payments securely
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> If required by law or to protect our rights
                  </li>
                  <li>
                    <strong>Service Providers:</strong> With trusted partners who help us operate our platform (all
                    bound by confidentiality agreements)
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the unlikely event of a merger or acquisition
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Data Security</h2>
                <p className="text-gray-600 leading-relaxed mb-4">We take security seriously:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>All data is encrypted in transit and at rest</li>
                  <li>We use industry-standard security practices</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to your data (only what's needed to provide service)</li>
                  <li>Secure payment processing through Stripe</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">You have control over your data:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct your information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your data in a standard format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from non-essential communications
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  To exercise these rights, contact us at{' '}
                  <a href="mailto:privacy@kumiko.com" className="text-gray-800 hover:underline">
                    privacy@kumiko.com
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed mb-4">We use minimal cookies:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the platform to function
                  </li>
                  <li>
                    <strong>Authentication:</strong> To keep you logged in
                  </li>
                  <li>
                    <strong>Preferences:</strong> To remember your settings
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We don't use tracking cookies, advertising cookies, or any third-party analytics that track you across
                  websites.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Questions?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@kumiko.com" className="text-gray-800 hover:underline">
                      privacy@kumiko.com
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
          <h2 className="text-4xl font-bold text-white mb-6">Questions About Your Data?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're here to help. Contact us if you have any questions about how we handle your information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Us
            </a>
            <a
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
