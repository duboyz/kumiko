'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface FancyCursorProps {
  children: React.ReactNode
}

export const FancyCursor = ({ children }: FancyCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorFollowerRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [hoverText, setHoverText] = useState('')

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorFollower = cursorFollowerRef.current
    const cursorText = cursorTextRef.current

    if (!cursor || !cursorFollower) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      })

      gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      })

      if (cursorText) {
        gsap.to(cursorText, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    // Mouse enter handler
    const handleMouseEnter = () => {
      setIsHovering(true)
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(cursorFollower, {
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    // Mouse leave handler
    const handleMouseLeave = () => {
      setIsHovering(false)
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(cursorFollower, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    // Mouse down handler
    const handleMouseDown = () => {
      setIsClicking(true)
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out',
      })
      gsap.to(cursorFollower, {
        scale: 1.2,
        duration: 0.1,
        ease: 'power2.out',
      })
    }

    // Mouse up handler
    const handleMouseUp = () => {
      setIsClicking(false)
      gsap.to(cursor, {
        scale: isHovering ? 1.5 : 1,
        duration: 0.1,
        ease: 'power2.out',
      })
      gsap.to(cursorFollower, {
        scale: isHovering ? 0.8 : 1,
        duration: 0.1,
        ease: 'power2.out',
      })
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 2,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(cursorFollower, {
          scale: 0.5,
          duration: 0.3,
          ease: 'power2.out',
        })

        // Add text for specific elements
        const text = element.getAttribute('data-cursor-text') || element.textContent?.trim() || ''
        if (text && text.length > 0 && text.length < 20) {
          setHoverText(text)
          if (cursorText) {
            gsap.to(cursorText, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
        }
      })

      element.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(cursorFollower, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })

        setHoverText('')
        if (cursorText) {
          gsap.to(cursorText, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.out',
          })
        }
      })
    })

    // Cleanup
    return () => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isHovering])

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Cursor follower */}
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Cursor text */}
      <div
        ref={cursorTextRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference opacity-0"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
          {hoverText}
        </div>
      </div>

      {children}
    </>
  )
}
