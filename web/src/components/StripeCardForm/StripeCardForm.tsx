'use client'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import * as React from 'react'

interface StripeCardFormProps {
  clientSecret: string
  onPaymentConfirmed: () => void
  onError: (error: string) => void
  disabled?: boolean
  onProcessingChange?: (processing: boolean) => void
}

export function StripeCardForm({
  clientSecret,
  onPaymentConfirmed,
  onError,
  disabled,
  onProcessingChange,
}: StripeCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const setProcessing = (value: boolean) => {
    setIsProcessing(value)
    onProcessingChange?.(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      onError('Stripe not loaded. Please refresh the page.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      onError('Card form not found. Please refresh the page.')
      return
    }

    if (!clientSecret) {
      onError('Payment intent not ready. Please try again.')
      return
    }

    setProcessing(true)

    try {
      // Confirm PaymentIntent with card details
      // For Standard accounts, the PaymentIntent is on the connected account
      // The client_secret is account-specific, so this will work
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (confirmError) {
        onError(confirmError.message || 'Failed to process payment. Please check your card details.')
        setProcessing(false)
        return
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        // Payment confirmed successfully
        onPaymentConfirmed()
      } else {
        onError('Payment was not completed. Please try again.')
        setProcessing(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      onError(errorMessage)
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-white">
        <CardElement options={cardElementOptions} />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing || disabled}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Confirm Payment'
        )}
      </Button>
    </form>
  )
}

