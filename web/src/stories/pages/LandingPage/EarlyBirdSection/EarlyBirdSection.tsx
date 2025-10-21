'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface EarlyBirdSectionProps {}

export function EarlyBirdSection({}: EarlyBirdSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Calculate time until end of year
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1) // January 1st of next year
      const difference = endOfYear.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (
      !sectionRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !cardRef.current ||
      !buttonRef.current ||
      !timerRef.current
    )
      return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0, scale: 0.8 })
    gsap.set(subtitleRef.current, { y: 30, opacity: 0, scale: 0.9 })
    gsap.set(timerRef.current, { y: 30, opacity: 0, scale: 0.8 })
    gsap.set(cardRef.current, { y: 60, opacity: 0, scale: 0.7 })
    gsap.set(buttonRef.current, { y: 30, opacity: 0, scale: 0.8 })

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })
      .to(
        subtitleRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.4)',
        },
        '-=0.4'
      )
      .to(
        timerRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      )
      .to(
        cardRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'back.out(2.0)',
        },
        '-=0.4'
      )
      .to(
        buttonRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div id="pricing" ref={sectionRef} className="py-24 px-8 bg-white text-black">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-16">
          <h2 ref={titleRef} className={`text-4xl md:text-6xl font-bold text-black mb-6 ${bebasNeue.className}`}>
            EARLY BIRD SPECIAL
          </h2>
          <p ref={subtitleRef} className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
            Be among the first to digitize your restaurant and lock in this exclusive pricing forever.
          </p>
        </div>

        {/* Countdown Timer */}
        <div ref={timerRef} className="mb-16">
          <div className="text-lg text-black font-medium mb-8">LIMITED TIME OFFER ENDS IN:</div>
          <div className="flex justify-center space-x-4 md:space-x-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-black bg-white border-2 border-black rounded-lg px-4 py-6 min-w-[120px] shadow-sm">
                {timeLeft.days}
              </div>
              <div className="text-sm text-black/60 mt-3 font-medium">DAYS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-black bg-white border-2 border-black rounded-lg px-4 py-6 min-w-[120px] shadow-sm">
                {timeLeft.hours}
              </div>
              <div className="text-sm text-black/60 mt-3 font-medium">HOURS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-black bg-white border-2 border-black rounded-lg px-4 py-6 min-w-[120px] shadow-sm">
                {timeLeft.minutes}
              </div>
              <div className="text-sm text-black/60 mt-3 font-medium">MINUTES</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-black bg-white border-2 border-black rounded-lg px-4 py-6 min-w-[120px] shadow-sm">
                {timeLeft.seconds}
              </div>
              <div className="text-sm text-black/60 mt-3 font-medium">SECONDS</div>
            </div>
          </div>
        </div>

        {/* Special Offer Card */}
        <div
          ref={cardRef}
          className="relative bg-white rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black"
        >
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold">EARLY BIRD SPECIAL</span>
          </div>

          <div className="relative z-10">
            {/* Price */}
            <div className="text-center mb-12">
              <div className="text-6xl font-bold text-black mb-2">$29</div>
              <div className="text-black/60 text-lg">per month</div>
              <div className="text-xl text-black font-bold mt-4">LOCKED IN FOR LIFE</div>
            </div>

            {/* NO TRANSACTION FEES BANNER */}
            <div className="bg-black text-white rounded-xl p-6 mb-8">
              <div className="text-2xl font-bold mb-2">ZERO TRANSACTION FEES!</div>
              <div className="text-white/80">Keep 100% of your revenue - no hidden fees, no surprises</div>
            </div>

            {/* Features */}
            <div className="mb-12">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="text-black mr-4 text-xl">✓</span>
                  <span className="text-black">Beautiful website included</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-4 text-xl">✓</span>
                  <span className="text-black">Online ordering system</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-4 text-xl">✓</span>
                  <span className="text-black">Mobile responsive design</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-4 text-xl">✓</span>
                  <span className="text-black">Easy menu updates</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-4 text-xl">✓</span>
                  <span className="text-black">Customer analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-4 text-xl">✓</span>
                  <span className="text-black font-bold">NO TRANSACTION FEES EVER</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <button
              ref={buttonRef}
              className="w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black"
            >
              GET STARTED NOW
            </button>

            {/* Limited time notice */}
            <p className="text-sm text-black/50 mt-6 text-center">
              * Limited time offer. Price locked in for life for early adopters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
