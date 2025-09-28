'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGSAP() {
  const containerRef = useRef<HTMLDivElement>(null)

  const fadeInUp = (selector: string, options?: any) => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(selector)

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        ...options,
      }
    )
  }

  const fadeInScale = (selector: string, options?: any) => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(selector)

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        ...options,
      }
    )
  }

  const scrollTriggerAnimation = (selector: string, animation: any, triggerOptions?: any) => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(selector)

    elements.forEach(element => {
      gsap.fromTo(element, animation.from, {
        ...animation.to,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...triggerOptions,
        },
      })
    })
  }

  const cleanup = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  useEffect(() => {
    return cleanup
  }, [])

  return {
    containerRef,
    fadeInUp,
    fadeInScale,
    scrollTriggerAnimation,
    cleanup,
  }
}
