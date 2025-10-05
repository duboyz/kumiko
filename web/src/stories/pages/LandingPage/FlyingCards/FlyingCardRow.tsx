'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FlyingCardRowProps {
  index: number
  leftImage: string
  rightImage: string
  leftAlt: string
  rightAlt: string
}

export const FlyingCardRow = ({ index, leftImage, rightImage, leftAlt, rightAlt }: FlyingCardRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const leftCardRef = useRef<HTMLDivElement>(null)
  const rightCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rowRef.current || !leftCardRef.current || !rightCardRef.current) return

    const row = rowRef.current
    const leftCard = leftCardRef.current
    const rightCard = rightCardRef.current

    // Set initial positions
    gsap.set(leftCard, { x: -300, rotation: -20, opacity: 0 })
    gsap.set(rightCard, { x: 300, rotation: 20, opacity: 0 })

    // Create ScrollTrigger animation with more reliable settings
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        toggleActions: 'play none none reverse',
        markers: true, // Set to true for debugging
        invalidateOnRefresh: true,
      },
    })

    // Animate cards flying in
    tl.to(leftCard, {
      x: 0,
      rotation: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    }).to(
      rightCard,
      {
        x: 0,
        rotation: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.5'
    )

    // Fallback: if ScrollTrigger doesn't work, animate after a delay
    const fallbackTimeout = setTimeout(() => {
      if (
        leftCard.style.transform.includes('translate3d(-300px') ||
        rightCard.style.transform.includes('translate3d(300px')
      ) {
        console.log('ScrollTrigger fallback triggered')
        gsap.to(leftCard, {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          delay: index * 0.3,
        })
        gsap.to(rightCard, {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          delay: index * 0.3 + 0.2,
        })
      }
    }, 1000)

    // Add hover effects
    const handleLeftHover = () => {
      gsap.to(leftCard, {
        scale: 1.02,
        rotation: -2,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    const handleLeftLeave = () => {
      gsap.to(leftCard, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    const handleRightHover = () => {
      gsap.to(rightCard, {
        scale: 1.02,
        rotation: 2,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    const handleRightLeave = () => {
      gsap.to(rightCard, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    leftCard.addEventListener('mouseenter', handleLeftHover)
    leftCard.addEventListener('mouseleave', handleLeftLeave)
    rightCard.addEventListener('mouseenter', handleRightHover)
    rightCard.addEventListener('mouseleave', handleRightLeave)

    return () => {
      clearTimeout(fallbackTimeout)
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === row) {
          trigger.kill()
        }
      })
      leftCard.removeEventListener('mouseenter', handleLeftHover)
      leftCard.removeEventListener('mouseleave', handleLeftLeave)
      rightCard.removeEventListener('mouseenter', handleRightHover)
      rightCard.removeEventListener('mouseleave', handleRightLeave)
    }
  }, [index])

  return (
    <div ref={rowRef} className="flying-card-row">
      <div ref={leftCardRef} className="flying-card flying-card--left">
        <img src={leftImage} alt={leftAlt} />
      </div>
      <div ref={rightCardRef} className="flying-card flying-card--right">
        <img src={rightImage} alt={rightAlt} />
      </div>
    </div>
  )
}
