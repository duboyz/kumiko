'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { stripeConnectApi, type GetConnectStatusResult } from '@shared/api/stripe-connect.api'

interface PaymentSettingsProps {
  restaurantId: string
}

export function PaymentSettings({ restaurantId }: PaymentSettingsProps) {
  const [status, setStatus] = useState<GetConnectStatusResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  const fetchStatus = useCallback(async () => {
    if (!restaurantId) return
    
    try {
      setIsLoading(true)
      const result = await stripeConnectApi.getConnectStatus(restaurantId)
      setStatus(result)
    } catch (error) {
      console.error('Failed to fetch connect status:', error)
      toast.error('Failed to load payment settings')
    } finally {
      setIsLoading(false)
    }
  }, [restaurantId])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const result = await stripeConnectApi.createOnboardingLink(restaurantId)
      // Redirect to Stripe onboarding
      window.location.href = result.onboardingUrl
    } catch (error) {
      console.error('Failed to create onboarding link:', error)
      toast.error('Failed to connect Stripe. Please try again.')
      setIsConnecting(false)
    }
  }

  // Check if user returned from Stripe onboarding
  useEffect(() => {
    if (!restaurantId) return
    
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('stripe_return') === 'true') {
      toast.success('Stripe account connected successfully!')
      // Refresh status directly from Stripe API (don't wait for webhook)
      stripeConnectApi
        .refreshConnectStatus(restaurantId)
        .then(() => {
          fetchStatus()
        })
        .catch((error) => {
          console.error('Failed to refresh status:', error)
          // Still fetch status in case webhook already updated it
          fetchStatus()
        })
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [restaurantId, fetchStatus])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const isConnected = status?.isConnected && status?.chargesEnabled

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Processing
            </CardTitle>
            <CardDescription>
              Connect your Stripe account to accept online payments from customers
            </CardDescription>
          </div>
          {isConnected && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <XCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Stripe account not connected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your Stripe account to start accepting online payments. You can set this up in just a few minutes.
                </p>
              </div>
            </div>
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Connect Stripe Account
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Stripe account connected
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your restaurant can now accept online payments. Customers will be able to pay for their orders directly through your website.
                </p>
              </div>
            </div>
            {status.accountId && (
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Account ID:</span> {status.accountId.substring(0, 20)}...
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

