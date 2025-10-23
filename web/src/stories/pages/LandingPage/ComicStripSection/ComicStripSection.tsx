'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import kumikoSnap from './assets/kumiko-snap.png'
import kumikoDeploy from './assets/kumiko-deploy.png'
import kumikoOrders from './assets/kumiko-orders.png'
import kumikoServed from './assets/kumiko-served.png'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ComicStripSectionProps {}

export function ComicStripSection({}: ComicStripSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  const images = [
    { src: kumikoSnap, alt: 'Kumiko Snap' },
    { src: kumikoDeploy, alt: 'Kumiko Deploy' },
    { src: kumikoOrders, alt: 'Kumiko Orders' },
    { src: kumikoServed, alt: 'Kumiko Served' },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    // Set initial state - images start invisible and slightly below
    gsap.set(imageRefs.current, {
      opacity: 0,
      y: 30,
    })

    // Create staggered fade-in animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    })

    // Stagger the animations with a slight delay between each image
    tl.to(imageRefs.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.15, // 150ms delay between each image
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              ref={el => {
                imageRefs.current[index] = el
              }}
              className="relative"
            >
              <Image
                src={image.src}
                alt={image.alt}
                className="w-full h-auto rounded-lg shadow-lg"
                priority={index < 2} // Prioritize first two images for faster loading
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
