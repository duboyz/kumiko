'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, ExternalLink, LayoutDashboard, Copy } from 'lucide-react'
import { gsap } from 'gsap'
import { toast } from 'sonner'

interface CelebrationStepProps {
  websiteName: string
  subdomain: string
  pagesCreated: number
  onViewWebsite: () => void
  onGoToDashboard: () => void
}

export function CelebrationStep({
  websiteName,
  subdomain,
  pagesCreated,
  onViewWebsite,
  onGoToDashboard,
}: CelebrationStepProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const checklistRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Confetti animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confetti: Array<{
      x: number
      y: number
      r: number
      d: number
      color: string
      tilt: number
      tiltAngleIncremental: number
      tiltAngle: number
    }> = []

    const confettiCount = 150
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
      })
    }

    let animationFrame: number

    function draw() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confetti.forEach((c, i) => {
        ctx.beginPath()
        ctx.lineWidth = c.r / 2
        ctx.strokeStyle = c.color
        ctx.moveTo(c.x + c.tilt + c.r / 4, c.y)
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4)
        ctx.stroke()

        c.tiltAngle += c.tiltAngleIncremental
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2
        c.tilt = Math.sin(c.tiltAngle - i / 3) * 15

        if (c.y > canvas.height) {
          confetti[i] = {
            ...c,
            x: Math.random() * canvas.width,
            y: -10,
          }
        }
      })

      animationFrame = requestAnimationFrame(draw)
    }

    // Start confetti after a delay
    const timeout = setTimeout(() => {
      draw()
    }, 1800)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  // GSAP timeline animation
  useEffect(() => {
    if (
      !containerRef.current ||
      !headingRef.current ||
      !checklistRef.current ||
      !cardRef.current ||
      !buttonsRef.current
    )
      return

    const checkItems = checklistRef.current.querySelectorAll('.check-item')

    // Set initial states
    gsap.set(headingRef.current, { scale: 0, opacity: 0 })
    gsap.set(checkItems, { x: -30, opacity: 0 })
    gsap.set(cardRef.current, { y: 30, opacity: 0 })
    gsap.set(buttonsRef.current, { y: 20, opacity: 0 })

    // Create timeline
    const tl = gsap.timeline()

    tl.to(headingRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
      .to(
        checkItems,
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '+=0.2'
      )
      .to(
        cardRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.2'
      )
      .to(
        buttonsRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )
  }, [])

  const websiteUrl = `${window.location.origin}/site/${subdomain}`

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(websiteUrl)
    toast.success('Website URL copied to clipboard!')
  }

  return (
    <div ref={containerRef} className="relative min-h-[600px] flex items-center justify-center">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Heading */}
          <div ref={headingRef}>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">🎉 You're Live!</h1>
            <p className="text-xl text-muted-foreground">Your restaurant is now online and ready for customers</p>
          </div>

          {/* Checklist */}
          <div ref={checklistRef} className="space-y-3">
            <div className="check-item flex items-center justify-center gap-3 text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Website created</span>
            </div>
            <div className="check-item flex items-center justify-center gap-3 text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Menu published</span>
            </div>
            <div className="check-item flex items-center justify-center gap-3 text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">{pagesCreated} pages generated</span>
            </div>
          </div>

          {/* Website preview card */}
          <Card ref={cardRef} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your website is live at:</p>
                  <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono">{websiteUrl}</code>
                    <Button variant="ghost" size="sm" onClick={handleCopyUrl} className="h-8 w-8 p-0">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground text-center">{websiteName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onViewWebsite} className="gap-2 text-lg px-8">
              <ExternalLink className="w-5 h-5" />
              View Your Website
            </Button>
            <Button size="lg" variant="outline" onClick={onGoToDashboard} className="gap-2 text-lg px-8">
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">You can customize your website anytime from the dashboard</p>
        </div>
      </div>
    </div>
  )
}
