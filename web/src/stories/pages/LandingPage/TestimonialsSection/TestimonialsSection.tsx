'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface TestimonialsSectionProps {}

// Testimonials data configuration - expanded for marquee effect
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
  {
    id: 4,
    name: 'David Kim',
    restaurant: 'Sakura Sushi',
    location: 'Seattle, WA',
    rating: 5,
    text: 'Our customers love the digital menu. The online ordering has been a game-changer for our business.',
    avatar: '👨‍🍣',
  },
  {
    id: 5,
    name: 'Lisa Martinez',
    restaurant: 'Casa de Tacos',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'Setting up our digital menu was so simple. We went from paper to digital in minutes!',
    avatar: '👩‍🍳',
  },
  {
    id: 6,
    name: 'James Wilson',
    restaurant: 'The Steakhouse',
    location: 'Chicago, IL',
    rating: 5,
    text: 'The reservation system is fantastic. We can manage our bookings without any hassle.',
    avatar: '👨‍🍖',
  },
] as const

// Duplicate testimonials for seamless marquee effect
const marqueeTestimonials = [...testimonials, ...testimonials]

export function TestimonialsSection({}: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const marquee1Ref = useRef<HTMLDivElement>(null)
  const marquee2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0 })
    gsap.set(subtitleRef.current, { y: 30, opacity: 0 })

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

    // Marquee animations
    if (marquee1Ref.current) {
      gsap.to(marquee1Ref.current, {
        x: '-50%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      })
    }

    if (marquee2Ref.current) {
      // Set initial position to start from the right
      gsap.set(marquee2Ref.current, { x: '-50%' })
      gsap.to(marquee2Ref.current, {
        x: '0%',
        duration: 25,
        ease: 'none',
        repeat: -1,
      })
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className={`py-24 px-8 bg-gradient-to-b from-white to-blue-50 ${bebasNeue.className}`}>
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

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* First Marquee Row - Moving Left */}
          <div className="mb-8">
            <div ref={marquee1Ref} className="flex gap-6 w-[200%]">
              {marqueeTestimonials.map((testimonial, index) => (
                <div key={`marquee1-${testimonial.id}-${index}`} className="flex-shrink-0 w-80">
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* Rating Stars */}
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">
                            ⭐
                          </span>
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 group-hover:text-gray-800 transition-colors duration-300">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center">
                        <div className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-sm">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            {testimonial.restaurant}
                          </div>
                          <div className="text-xs text-gray-500">{testimonial.location}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Second Marquee Row - Moving Right */}
          <div>
            <div ref={marquee2Ref} className="flex gap-6 w-[200%]">
              {marqueeTestimonials.map((testimonial, index) => (
                <div key={`marquee2-${testimonial.id}-${index}`} className="flex-shrink-0 w-80">
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* Rating Stars */}
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">
                            ⭐
                          </span>
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 group-hover:text-gray-800 transition-colors duration-300">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center">
                        <div className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-sm">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            {testimonial.restaurant}
                          </div>
                          <div className="text-xs text-gray-500">{testimonial.location}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
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
