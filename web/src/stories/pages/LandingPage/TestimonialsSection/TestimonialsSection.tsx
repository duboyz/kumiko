'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface TestimonialsSectionProps {}

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    restaurant: 'Golden Dragon',
    location: 'San Francisco, CA',
    text: 'Kumiko transformed our paper menu into a beautiful website in just 10 minutes. Our online orders have increased by 300%!',
    rating: 5,
    avatar: '👩‍🍳',
  },
  {
    id: 2,
    name: 'Marco Rodriguez',
    restaurant: 'Bella Vista',
    location: 'Austin, TX',
    text: 'Finally, a solution that actually works. Our customers love the easy ordering system and we love how simple it is to update our menu.',
    rating: 5,
    avatar: '👨‍🍳',
  },
  {
    id: 3,
    name: 'Emily Johnson',
    restaurant: 'The Garden Cafe',
    location: 'Portland, OR',
    text: 'The mobile responsiveness is perfect. Our customers can easily browse and order from their phones. Game changer!',
    rating: 5,
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
    gsap.set(testimonialRefs.current, { y: 60, opacity: 0, scale: 0.9 })

    // Fallback: ensure elements are visible after a delay
    const fallbackTimer = setTimeout(() => {
      if (titleRef.current) titleRef.current.style.opacity = '1'
      if (subtitleRef.current) subtitleRef.current.style.opacity = '1'
      testimonialRefs.current.forEach(ref => {
        if (ref) ref.style.opacity = '1'
      })
    }, 2000)

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
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.2,
      scrollTrigger: {
        trigger: testimonialsRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })

    // Cleanup
    return () => {
      clearTimeout(fallbackTimer)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div id="testimonials" ref={sectionRef} className="py-24 px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${bebasNeue.className}`}>
            What Our Customers Say
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real restaurants, real results. See how Kumiko is helping businesses grow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={el => {
                testimonialRefs.current[index] = el
              }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ⭐
                  </span>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-800 mb-6 leading-relaxed italic text-base">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="text-3xl mr-4">{testimonial.avatar}</div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-700">{testimonial.restaurant}</div>
                  <div className="text-xs text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
