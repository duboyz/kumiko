'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface TestimonialsSectionProps {}

// Testimonials data configuration
const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    restaurant: 'Golden Dragon Restaurant',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Kumiko transformed our traditional menu into something our customers actually want to use. Orders increased by 40% in the first month!',
    avatar: '👩‍🍳',
  },
  {
    id: 2,
    name: 'Marco Rodriguez',
    restaurant: 'Bella Vista Bistro',
    location: 'Austin, TX',
    rating: 5,
    text: 'The setup was incredibly easy. I had our digital menu live in under 30 minutes. Our customers love the online ordering feature.',
    avatar: '👨‍🍳',
  },
  {
    id: 3,
    name: 'Emily Johnson',
    restaurant: 'The Garden Cafe',
    location: 'Portland, OR',
    rating: 5,
    text: 'Finally, a solution that actually works for small restaurants. The analytics help us understand what our customers want most.',
    avatar: '👩‍💼',
  },
] as const

export function TestimonialsSection({}: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !testimonialsRef.current) return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(subtitleRef.current, { y: 30, opacity: 0 })
    gsap.set(testimonialRefs.current, { y: 80, opacity: 0, rotationY: 15 })

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

    // Testimonials animation
    gsap.to(testimonialRefs.current, {
      y: 0,
      opacity: 1,
      rotationY: 0,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: testimonialsRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })

    // Hover animations for individual testimonials
    testimonialRefs.current.forEach((testimonialRef, index) => {
      if (!testimonialRef) return

      const hoverTl = gsap.timeline({ paused: true })
      hoverTl.to(testimonialRef, {
        y: -15,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
      })

      testimonialRef.addEventListener('mouseenter', () => hoverTl.play())
      testimonialRef.addEventListener('mouseleave', () => hoverTl.reverse())
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`py-24 px-8 bg-gradient-to-b from-white to-blue-50 ${bebasNeue.className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Loved by Restaurants
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of restaurants that have already transformed their business with Kumiko.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={el => {
                testimonialRefs.current[index] = el
              }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 group-hover:text-gray-800 transition-colors duration-300">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {testimonial.restaurant}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Restaurants Digitized
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                40%
              </div>
              <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Average Order Increase
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                30min
              </div>
              <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Average Setup Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}