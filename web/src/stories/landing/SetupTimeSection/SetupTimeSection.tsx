'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface SetupTimeSectionProps {}

export function SetupTimeSection({}: SetupTimeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const testimonialCardsRef = useRef<(HTMLDivElement | null)[]>([])

  const stats = [
    { number: '15', unit: 'minutes', label: 'Average setup time', icon: '⚡' },
    { number: '1', unit: 'photo', label: 'Menu upload needed', icon: '📸' },
    { number: '0', unit: 'tech skills', label: 'Required', icon: '🚫' },
  ]

  const testimonials = [
    {
      name: 'Maria',
      restaurant: 'Pizza Corner',
      location: 'Oslo',
      setupTime: '12 minutes',
      quote:
        'I was skeptical about the 30-minute setup claim, but I was literally taking orders in 12 minutes. Just took a photo of my menu and that was it!',
      avatar: '🍕',
    },
    {
      name: 'Erik',
      restaurant: 'Sushi Express',
      location: 'Bergen',
      setupTime: '18 minutes',
      quote:
        'Other platforms took weeks to set up. Kumiko was ready in under 20 minutes. My customers love the simple ordering process.',
      avatar: '🍣',
    },
    {
      name: 'Anna',
      restaurant: 'Burger Palace',
      location: 'Trondheim',
      setupTime: '8 minutes',
      quote:
        'Fastest setup ever! Took a picture of my menu, added my address, and I was live. No complicated forms or technical stuff.',
      avatar: '🍔',
    },
  ]

  // Number counting animation
  const animateNumber = (element: HTMLElement, targetNumber: number, duration: number = 1) => {
    gsap.fromTo(
      element,
      { innerText: 0 },
      {
        innerText: targetNumber,
        duration: duration,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function () {
          element.innerText = Math.ceil(this.targets()[0].innerText).toString()
        },
      }
    )
  }

  // Add hover animations for cards
  const addHoverAnimations = () => {
    statCardsRef.current.forEach(card => {
      if (card) {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      }
    })

    testimonialCardsRef.current.forEach(card => {
      if (card) {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -5,
            scale: 1.01,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      }
    })
  }

  useEffect(() => {
    if (
      !sectionRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !statsRef.current ||
      !testimonialsRef.current ||
      !ctaRef.current
    )
      return

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current], { y: 30, opacity: 0 })
    gsap.set(statsRef.current, { y: 40, opacity: 0 })
    gsap.set(testimonialsRef.current, { y: 30, opacity: 0 })
    gsap.set(ctaRef.current, { y: 20, opacity: 0 })

    // Set initial states for individual cards
    gsap.set(statCardsRef.current, { y: 20, opacity: 0, scale: 0.95 })
    gsap.set(testimonialCardsRef.current, { y: 15, opacity: 0, scale: 0.98 })

    // Create main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })

    // Animate main elements
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
      .to(
        subtitleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        statsRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      // Animate stat cards with stagger
      .to(
        statCardsRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.4)',
          stagger: 0.15,
          onComplete: () => {
            // Animate numbers after cards appear
            const numberElements = document.querySelectorAll('[data-number]')
            numberElements.forEach((el, index) => {
              const targetNumber = parseInt(stats[index]?.number || '0')
              if (targetNumber > 0) {
                animateNumber(el as HTMLElement, targetNumber, 1.2)
              }
            })
          },
        },
        '-=0.3'
      )
      .to(
        testimonialsRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.1'
      )
      // Animate testimonial cards with stagger
      .to(
        testimonialCardsRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
        },
        '-=0.2'
      )
      .to(
        ctaRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.1'
      )

    // Add hover animations after initial animation
    setTimeout(() => {
      addHoverAnimations()
    }, 2000)

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-white to-gray-50 ${bebasNeue.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Set Up in Minutes, Not Weeks
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            While other platforms require complex setup and technical knowledge, Kumiko gets you online in minutes with
            just a photo of your menu.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              ref={el => {
                statCardsRef.current[index] = el
              }}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  <span data-number className="inline-block">
                    {stat.number}
                  </span>{' '}
                  <span className="text-2xl text-gray-600">{stat.unit}</span>
                </div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div ref={testimonialsRef}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Real Setup Times from Real Restaurants</h3>
            <p className="text-lg text-gray-600">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                ref={el => {
                  testimonialCardsRef.current[index] = el
                }}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{testimonial.avatar}</div>
                    <Badge className="bg-gray-800 text-white mb-3">{testimonial.setupTime} setup</Badge>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.restaurant} • {testimonial.location}
                    </p>
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div ref={ctaRef} className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Online in Minutes?</h3>
            <p className="text-lg text-gray-600 mb-6">
              Join hundreds of restaurants that went from paper menu to online orders in under 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your 15-Minute Setup
              </a>
              <a
                href="/contact"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
