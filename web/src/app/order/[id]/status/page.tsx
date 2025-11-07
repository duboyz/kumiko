'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useOrderById, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, formatPrice, Currency } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, MapPin, Mail, Phone, Calendar, FileText, Store, Check } from 'lucide-react'
import { gsap } from 'gsap'
import Image from 'next/image'
import KumikoCelebration from '@/stories/onboarding/assets/kumiko-celebration.png'

export default function OrderStatusPage() {
  const params = useParams()
  const orderId = params.id as string
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { data: order, isLoading, error } = useOrderById(orderId)

  // Confetti animation
  useEffect(() => {
    if (!order) return

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
    let startTime: number | null = null
    const duration = 5000 // 5 seconds
    const fadeStart = 4000 // Start fading after 4 seconds

    function draw() {
      if (!ctx || !canvas) return

      // Track start time on first frame
      if (startTime === null) {
        startTime = Date.now()
      }

      const elapsed = Date.now() - startTime

      // Stop and clear canvas after 5 seconds
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate opacity for fade-out (1.0 to 0.0 during last second)
      let opacity = 1.0
      if (elapsed > fadeStart) {
        const fadeProgress = (elapsed - fadeStart) / (duration - fadeStart)
        opacity = Math.max(0, 1 - fadeProgress)
      }

      // Set global alpha for fade effect
      ctx.globalAlpha = opacity

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

      // Reset global alpha
      ctx.globalAlpha = 1.0

      animationFrame = requestAnimationFrame(draw)
    }

    // Start confetti after a delay
    const timeout = setTimeout(() => {
      draw()
    }, 500)

    return () => {
      clearTimeout(timeout)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [order])

  // GSAP timeline animation
  useEffect(() => {
    if (!order || !headingRef.current || !imageRef.current || !successRef.current || !contentRef.current) return

    // Set initial states
    gsap.set(headingRef.current, { scale: 0, opacity: 0 })
    gsap.set(imageRef.current, { scale: 0, opacity: 0, rotation: -10 })
    gsap.set(successRef.current, { y: 20, opacity: 0 })
    gsap.set(contentRef.current, { y: 30, opacity: 0 })

    // Create timeline
    const tl = gsap.timeline()

    tl.to(headingRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
      .to(
        imageRef.current,
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '+=0.1'
      )
      .to(
        successRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '+=0.2'
      )
      .to(
        contentRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.2'
      )
  }, [order])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorMessage message={error instanceof Error ? error.message : 'Order not found'} />
      </div>
    )
  }

  // Parse currency from string
  const currency = Currency[order.restaurant.currency as keyof typeof Currency] || Currency.USD
  const pickupDate = new Date(order.pickupDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-50 py-8 px-4">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Celebration Header */}
        <div className="text-center space-y-6 pb-6">
          {/* Kumiko Celebration Image */}
          <div ref={imageRef} className="flex justify-center">
            <Image
              src={KumikoCelebration}
              alt="Kumiko celebrating"
              width={300}
              height={300}
              className="max-w-full h-auto w-48 sm:w-64"
            />
          </div>

          {/* Success Message */}
          <div ref={successRef} className="flex items-center justify-center gap-3 text-lg">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium text-gray-700">Your order has been confirmed</span>
          </div>
        </div>

        {/* Order Details */}
        <div ref={contentRef} className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-gray-600">Order ID: {order.id}</p>
          </div>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Status</CardTitle>
                <Badge className={ORDER_STATUS_COLORS[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-semibold text-lg">{order.restaurant.name}</p>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p>{order.restaurant.address}</p>
                  <p>{order.restaurant.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pickup Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date:</span>
                <span>{pickupDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Time:</span>
                <span>{order.pickupTime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Name:</span>
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Phone:</span>
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email:</span>
                <span>{order.customerEmail}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.menuItemName}</p>
                        {item.menuItemOptionName && <p className="text-sm text-gray-600">{item.menuItemOptionName}</p>}
                        {item.specialInstructions && (
                          <div className="flex items-start gap-1 mt-1">
                            <FileText className="h-3 w-3 mt-1 text-gray-500" />
                            <p className="text-sm text-gray-500 italic">{item.specialInstructions}</p>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.priceAtOrder * item.quantity, currency)}</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.priceAtOrder, currency)} each</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalAmount, currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          {order.additionalNote && order.additionalNote.trim() !== '' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.additionalNote}</p>
              </CardContent>
            </Card>
          )}

          {/* Order Metadata */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 space-y-1">
                <p>Order placed: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
