'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripeCardForm } from '@/components/StripeCardForm/StripeCardForm'
import { stripeConnectApi } from '@shared'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function OrderPaymentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = params.id as string

  const clientSecretFromUrl = searchParams.get('client_secret')

  const [clientSecret, setClientSecret] = useState<string | null>(clientSecretFromUrl)
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [isLoadingStripe, setIsLoadingStripe] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load Stripe publishable key
  useEffect(() => {
    const loadStripeKey = async () => {
      try {
        const publishableKey = await stripeConnectApi.getPublishableKey()
        if (publishableKey) {
          setStripePromise(loadStripe(publishableKey))
        } else {
          toast.error('Stripe is not configured. Please try again later.')
        }
      } catch (error) {
        console.error('Failed to load Stripe publishable key:', error)
        toast.error('Unable to load payment form. Please try again later.')
      } finally {
        setIsLoadingStripe(false)
      }
    }
    loadStripeKey()
  }, [])

  // If client_secret missing, block
  useEffect(() => {
    if (!clientSecret) {
      toast.error('Payment is not available for this order.')
    }
  }, [clientSecret])

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4 max-w-md">
          <h1 className="text-xl font-semibold text-gray-900">Payment not available</h1>
          <p className="text-gray-600">We could not start the payment for this order.</p>
          <Button onClick={() => router.push('/')}>Go back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-lg space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Complete Payment</h1>
          <p className="text-sm text-gray-600 mt-1">Order ID: {orderId}</p>
        </div>

        {isLoadingStripe || !stripePromise ? (
          <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-600">Loading payment form...</div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCardForm
              clientSecret={clientSecret}
              onPaymentConfirmed={() => {
                toast.success('Payment confirmed!')
                router.push(`/order/${orderId}/status`)
              }}
              onError={error => {
                toast.error(error)
              }}
              disabled={isProcessing}
              onProcessingChange={setIsProcessing}
            />
          </Elements>
        )}

        <div className="flex justify-between items-center pt-2">
          <Button variant="ghost" onClick={() => router.back()} disabled={isProcessing}>
            ← Back
          </Button>
          <Button variant="outline" onClick={() => router.push(`/order/${orderId}/status`)} disabled={isProcessing}>
            View order status
          </Button>
        </div>
      </div>
    </div>
  )
}
