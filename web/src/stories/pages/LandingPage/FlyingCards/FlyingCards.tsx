'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FlyingCardRow } from './FlyingCardRow'
import './FlyingCards.css'

gsap.registerPlugin(ScrollTrigger)

export const FlyingCards = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const cardImages = [
    {
      left: 'https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg',
      right: 'https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg',
      leftAlt: 'Business operations',
      rightAlt: 'Team collaboration',
    },
    {
      left: 'https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg',
      right: 'https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg',
      leftAlt: 'Analytics dashboard',
      rightAlt: 'Customer management',
    },
    {
      left: 'https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg',
      right: 'https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg',
      leftAlt: 'Smart scheduling',
      rightAlt: 'Growth insights',
    },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Main content animations
    const scrollTriggerSettings = {
      trigger: container,
      start: 'top 25%',
      toggleActions: 'play reverse play reverse',
    }

    // Add a class to indicate GSAP is loaded
    const logoElement = container.querySelector('.flying-cards-logo')
    if (logoElement) {
      logoElement.classList.add('gsap-loaded')
    }

    gsap.to('.flying-cards-logo', {
      scale: 1,
      duration: 0.5,
      ease: 'power1.out',
      scrollTrigger: scrollTriggerSettings,
    })

    gsap.to('.flying-cards-line p', {
      y: 0,
      duration: 0.5,
      ease: 'power1.out',
      stagger: 0.1,
      scrollTrigger: scrollTriggerSettings,
    })

    gsap.to('.flying-cards-button', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
      delay: 0.25,
      scrollTrigger: scrollTriggerSettings,
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill()
        }
      })
    }
  }, [])

  const generateRows = () => {
    return cardImages.map((images, index) => (
      <FlyingCardRow
        key={index}
        index={index}
        leftImage={images.left}
        rightImage={images.right}
        leftAlt={images.leftAlt}
        rightAlt={images.rightAlt}
      />
    ))
  }

  return (
    <div ref={containerRef} className="flying-cards-container">
      <div className="flying-cards-main">
        <div className="flying-cards-content">
          <div className="flying-cards-logo">
            <img
              src="https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg"
              alt="Kumiko Logo"
              width={100}
              height={100}
            />
          </div>
          <div className="flying-cards-copy">
            <div className="flying-cards-line">
              <p>Streamline your business operations.</p>
            </div>
            <div className="flying-cards-line">
              <p>One platform. Endless possibilities.</p>
            </div>
            <div className="flying-cards-line">
              <p>Take the fast lane to success.</p>
            </div>
          </div>
          <div className="flying-cards-btn">
            <button className="flying-cards-button">Get Started</button>
          </div>
        </div>

        {generateRows()}

        {/* Add some extra height for scrolling */}
        <div style={{ height: '100vh' }}></div>
      </div>
    </div>
  )
}
