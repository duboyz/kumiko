'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface AboutPageProps {}

export function AboutPage({}: AboutPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial states
    gsap.set([heroRef.current, missionRef.current, teamRef.current, valuesRef.current, storyRef.current], {
      y: 50,
      opacity: 0,
    })

    // Animate sections on scroll
    const sections = [heroRef.current, missionRef.current, teamRef.current, valuesRef.current, storyRef.current]

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

  const teamMembers = [
    {
      name: 'Jonathan Gulliksen',
      role: 'Co-Founder & Developer',
      bio: 'Developer who loves food and believes technology should empower, not exploit. Passionate about fair pricing and helping small businesses compete.',
      avatar: '👨‍💻',
    },
    {
      name: 'Vegard',
      role: 'Co-Founder & Developer',
      bio: 'Developer with a love for great food and a mission to level the playing field. Believes small kitchens deserve the same tools as big chains.',
      avatar: '👨‍🍳',
    },
  ]

  const values = [
    {
      title: 'Fair Pricing',
      description: "We believe small businesses shouldn't be gouged by big tech. Fair prices for fair service.",
      icon: '⚖️',
    },
    {
      title: 'For the Little Guy',
      description: "We're developers who love food and want to help small kitchens compete with the big chains.",
      icon: '🤝',
    },
    {
      title: 'Simple Technology',
      description: 'No overcomplicated systems. Just simple tools that actually work for real restaurants.',
      icon: '✨',
    },
    {
      title: 'Transparency',
      description: 'No hidden fees, no surprise charges. What you see is what you pay.',
      icon: '🔍',
    },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${bebasNeue.className}`}>
      {/* Hero Section */}
      <div ref={heroRef} className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">About Kumiko</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We're two developers who love food and believe small restaurants deserve fair pricing and simple technology.
            No more getting gouged by big tech companies taking way too much profit from hardworking kitchen owners.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div ref={storyRef} className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Kumiko started with a simple frustration: we're developers who love food, and we kept seeing small
                  restaurants getting ripped off by big tech companies charging outrageous fees and taking way too much
                  profit.
                </p>
                <p>
                  Jonathan and Vegard, both developers with a passion for great food, watched as small kitchen owners
                  struggled to afford the same digital tools that big chains use. The existing solutions were either too
                  expensive, too complicated, or both.
                </p>
                <p>
                  We decided enough was enough. Why should a small family restaurant pay 15-20% of their revenue just to
                  take online orders? That's insane! We built Kumiko to give small restaurants the same powerful tools
                  as big chains, but at fair prices that actually make sense.
                </p>
                <p>
                  Today, we're helping small kitchens compete on a level playing field. No more getting gouged by big
                  tech. Just simple, affordable tools that help you serve great food and grow your business.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Restaurants Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">40%</div>
                  <div className="text-sm text-gray-600">Average Order Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">30min</div>
                  <div className="text-sm text-gray-600">Average Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">99%</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div ref={missionRef} className="py-16 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To give small restaurants the same powerful digital tools as big chains, but at fair prices that don't
                  gouge hardworking kitchen owners. Technology should empower, not exploit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A world where small restaurants can compete with big chains on a level playing field. Where technology
                  serves the little guy instead of exploiting them with outrageous fees and complicated systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Values */}
      <div ref={valuesRef} className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div ref={teamRef} className="py-16 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two developers who love food and are tired of seeing small restaurants get ripped off by big tech
              companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4 bg-gray-100 text-gray-800">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Mission?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the fight against big tech exploitation. Get fair pricing and simple tools for your restaurant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
