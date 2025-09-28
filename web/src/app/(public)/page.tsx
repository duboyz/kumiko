'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'
import { FlyingCardRow } from '@/components/FlyingCardRow'
import './landing.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  useEffect(() => {
    // Hero section title animation
    const heroTitle = gsap.timeline()

    heroTitle
      .fromTo(
        '.hero-title',
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
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
        '-=0.6'
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
        '-=0.4'
      )

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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      heroTitle.kill()
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
      <div className="landing-page">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Welcome to</span>
              <span className="title-brand">Kumiko</span>
            </h1>
            <p className="hero-subtitle">
              Your modern booking and business management platform.
              <br />
              Streamline operations, delight customers, and grow your business.
            </p>
            <div className="hero-buttons">
              <Link href="/register" className="btn-primary">
                Get Started Free
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="img">
            <img
              src="https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg"
              alt="Kumiko Platform"
              width={100}
              height={100}
            />
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
