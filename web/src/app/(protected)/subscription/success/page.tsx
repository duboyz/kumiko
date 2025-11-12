'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { useUserSubscription } from '@shared/hooks/subscription.hooks'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const queryClient = useQueryClient()
  const [isVerifying, setIsVerifying] = useState(true)
  const { data: subscription, refetch } = useUserSubscription()

  useEffect(() => {
    // Function to check if subscription is created
    const verifySubscription = async () => {
      // Invalidate and refetch subscription data
      await queryClient.invalidateQueries({ queryKey: ['userSubscription'] })
      const result = await refetch()

      // If still no subscription, retry after a delay (webhook might still be processing)
      if (!result.data?.subscription && sessionId) {
        setTimeout(async () => {
          await queryClient.invalidateQueries({ queryKey: ['userSubscription'] })
          await refetch()
          setIsVerifying(false)
        }, 2000) // Wait 2 seconds and try again
      } else {
        setIsVerifying(false)
      }
    }

    if (sessionId) {
      console.log('Checkout session completed:', sessionId)
      verifySubscription()
    } else {
      setIsVerifying(false)
    }
  }, [sessionId, queryClient, refetch])

  if (isVerifying) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verifying your subscription...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
          <CardDescription>
            Welcome aboard! Your subscription has been activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            You now have access to all features included in your plan. Your 14-day free trial has started.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/subscription">View Subscription</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
