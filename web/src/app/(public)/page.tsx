'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'
import { FlyingCardRow } from '@/components/FlyingCardRow'
import './landing.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const loadingRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)
  useEffect(() => {
    // Loading animation
    const loadingTl = gsap.timeline({
      onComplete: () => {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      },
    })

    if (loadingRef.current) {
      const loadingText = loadingRef.current.querySelector('.loading-text')

      loadingTl
        .to(loadingText, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        })
        .to(loadingText, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 1,
        })
        .to(loadingRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
    }

    // Hero section title animation (starts after loading)
    const heroTimeout = setTimeout(() => {
      if (!isMountedRef.current) return // Don't run if component is unmounting

      const heroTitle = gsap.timeline()

      // Split text animation for the title
      const titleElement = document.querySelector('.title-word')
      if (titleElement) {
        const text = titleElement.textContent || ''
        titleElement.innerHTML = text
          .split('')
          .map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('')

        const chars = titleElement.querySelectorAll('.char')

        heroTitle
          .fromTo(
            chars,
            {
              y: 100,
              opacity: 0,
              rotationX: -90,
            },
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.8,
              ease: 'back.out(1.7)',
              stagger: 0.05,
            }
          )
          .fromTo(
            '.hero-subtitle',
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            },
            '-=0.4'
          )
          .fromTo(
            '.hero-buttons',
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
            },
            '-=0.3'
          )
      }
    }, 2000)

    // Main content animations
    const scrollTriggerSettings = {
      trigger: '.main',
      start: 'top 25%',
      toggleActions: 'play reverse play reverse',
    }

    // Add a class to indicate GSAP is loaded
    const logoElement = document.querySelector('.logo')
    if (logoElement) {
      logoElement.classList.add('gsap-loaded')
    }

    gsap.to('.logo', {
      scale: 1,
      duration: 0.5,
      ease: 'power1.out',
      scrollTrigger: scrollTriggerSettings,
    })

    gsap.to('.line p', {
      y: 0,
      duration: 0.5,
      ease: 'power1.out',
      stagger: 0.1,
      scrollTrigger: scrollTriggerSettings,
    })

    gsap.to('button', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
      delay: 0.25,
      scrollTrigger: scrollTriggerSettings,
    })

    return () => {
      isMountedRef.current = false
      clearTimeout(heroTimeout)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      loadingTl.kill()
      // Clean up any hero animations if they exist
      const heroAnimations = gsap.getTweensOf('.hero-title, .hero-subtitle, .hero-buttons, .char')
      heroAnimations.forEach(tween => tween.kill())
    }
  }, [])

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
    <ReactLenis root>
      {isLoading && (
        <div ref={loadingRef} className="loading-overlay">
          <div className="loading-text">Kumiko</div>
        </div>
      )}
      <div className="landing-page">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-word" data-word="Kumiko">
                Kumiko
              </span>
            </h1>
            <p className="hero-subtitle">Your modern booking and business management platform</p>
            <div className="hero-buttons">
              <Link href="/register" className="btn-primary">
                Get Started Free
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="main">
          <div className="main-content">
            <div className="logo">
              <img
                src="https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg"
                alt="Kumiko Logo"
                width={100}
                height={100}
              />
            </div>
            <div className="copy">
              <div className="line">
                <p>Streamline your business operations.</p>
              </div>
              <div className="line">
                <p>One platform. Endless possibilities.</p>
              </div>
              <div className="line">
                <p>Take the fast lane to success.</p>
              </div>
            </div>
            <div className="btn">
              <Link href="/register">
                <button>Get Started</button>
              </Link>
            </div>
          </div>

          {generateRows()}
        </section>

        <section className="footer">
          <Link href="/about">Learn more about Kumiko</Link>
        </section>
      </div>
    </ReactLenis>
  )
}
