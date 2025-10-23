'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bebasNeue } from '@shared'
import Image from 'next/image'
import EarlyBirdImage from '../assets/earlybird.png'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface EarlyBirdSectionProps {}

export function EarlyBirdSection({}: EarlyBirdSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
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
      !imageRef.current ||
      !cardRef.current ||
      !buttonRef.current ||
      !timerRef.current
    )
      return

    // Set initial states
    gsap.set(titleRef.current, { y: 50, opacity: 0, scale: 0.8 })
    gsap.set(subtitleRef.current, { y: 30, opacity: 0, scale: 0.9 })
    gsap.set(imageRef.current, { y: 40, opacity: 0, scale: 0.8, rotation: -5 })
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
        imageRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.0,
          ease: 'back.out(1.5)',
        },
        '-=0.2'
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
    <div id="pricing" ref={sectionRef} className="py-24 px-8 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-12">
          <h2 ref={titleRef} className={`text-4xl md:text-6xl font-bold text-black mb-6 ${bebasNeue.className}`}>
            EARLY BIRD SPECIAL
          </h2>
          <p ref={subtitleRef} className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed">
            Be among the first to digitize your restaurant and lock in this exclusive pricing forever.
          </p>
        </div>

        {/* Hero Image */}
        <div ref={imageRef} className="flex justify-center mb-12">
          <Image
            src={EarlyBirdImage}
            alt="Early Bird Special"
            width={300}
            height={200}
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Countdown Timer */}
        <div ref={timerRef} className="mb-12">
          <div className="text-lg text-black font-medium mb-6">LIMITED TIME OFFER ENDS IN:</div>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-black bg-gray-100 rounded-lg px-4 py-3 min-w-[80px]">
                {timeLeft.days}
              </div>
              <div className="text-sm text-black/60 mt-2">DAYS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black bg-gray-100 rounded-lg px-4 py-3 min-w-[80px]">
                {timeLeft.hours}
              </div>
              <div className="text-sm text-black/60 mt-2">HOURS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black bg-gray-100 rounded-lg px-4 py-3 min-w-[80px]">
                {timeLeft.minutes}
              </div>
              <div className="text-sm text-black/60 mt-2">MINUTES</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black bg-gray-100 rounded-lg px-4 py-3 min-w-[80px]">
                {timeLeft.seconds}
              </div>
              <div className="text-sm text-black/60 mt-2">SECONDS</div>
            </div>
          </div>
        </div>

        {/* Simple Offer Card */}
        <div ref={cardRef} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-black">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-black mb-2">$29</div>
            <div className="text-black/60 text-lg">per month</div>
            <div className="text-xl text-black font-bold mt-4">LOCKED IN FOR LIFE</div>
          </div>

          <div className="bg-black text-white rounded-xl p-4 mb-6">
            <div className="text-xl font-bold">ZERO TRANSACTION FEES!</div>
            <div className="text-white/80">Keep 100% of your revenue</div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center">
              <span className="text-black mr-3 text-xl">✓</span>
              <span className="text-black">Beautiful website included</span>
            </div>
            <div className="flex items-center">
              <span className="text-black mr-3 text-xl">✓</span>
              <span className="text-black">Online ordering system</span>
            </div>
            <div className="flex items-center">
              <span className="text-black mr-3 text-xl">✓</span>
              <span className="text-black">Mobile responsive design</span>
            </div>
            <div className="flex items-center">
              <span className="text-black mr-3 text-xl">✓</span>
              <span className="text-black">Easy menu updates</span>
            </div>
            <div className="flex items-center">
              <span className="text-black mr-3 text-xl">✓</span>
              <span className="text-black">Customer analytics</span>
            </div>
          </div>

          <button
            ref={buttonRef}
            className="w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black"
          >
            GET STARTED NOW
          </button>

          <p className="text-sm text-black/50 mt-4">
            * Limited time offer. Price locked in for life for early adopters.
          </p>
        </div>
      </div>
    </div>
  )
}
