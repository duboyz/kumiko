'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface SmoothScrollLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  offset?: number
}

export const SmoothScrollLink = ({ href, children, className = '', offset = 0 }: SmoothScrollLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const link = linkRef.current
    if (!link) return

    const handleClick = (e: Event) => {
      e.preventDefault()

      // Get the target element
      const targetId = href.replace('#', '')
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Use Lenis for smooth scrolling
        const lenis = (window as any).lenis
        if (lenis) {
          lenis.scrollTo(targetElement, {
            offset: offset,
            duration: 1.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          })
        } else {
          // Fallback to native smooth scrolling
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    }

    link.addEventListener('click', handleClick)

    return () => {
      link.removeEventListener('click', handleClick)
    }
  }, [href, offset])

  return (
    <a ref={linkRef} href={href} className={className}>
      {children}
    </a>
  )
}
