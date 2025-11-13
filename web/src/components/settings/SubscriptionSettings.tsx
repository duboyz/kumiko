'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserSubscription } from '@shared/hooks/subscription.hooks'
import { LoadingSpinner } from '@/components'
import { useRouter } from 'next/navigation'
import { Crown, Calendar, CreditCard } from 'lucide-react'

export function SubscriptionSettings() {
  const router = useRouter()
  const { data: result, isLoading } = useUserSubscription()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (!result?.subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to unlock all features and create unlimited menus.
          </p>
          <Button onClick={() => router.push('/subscription')}>View Plans</Button>
        </CardContent>
      </Card>
    )
  }

  const subscription = result.subscription

  const getStatusBadge = () => {
    if (subscription.isTrialing && !subscription.hasPaymentMethod) {
      return { text: 'Free Trial', color: 'bg-blue-500' }
    }
    if (subscription.isTrialing && subscription.hasPaymentMethod) {
      return { text: 'Trial Period', color: 'bg-blue-500' }
    }
    switch (subscription.status) {
      case 'Active':
        return { text: 'Active', color: 'bg-green-500' }
      case 'Canceled':
        return { text: 'Canceled', color: 'bg-yellow-500' }
      case 'PastDue':
        return { text: 'Past Due', color: 'bg-red-500' }
      case 'Expired':
        return { text: 'Expired', color: 'bg-gray-500' }
      default:
        return { text: subscription.status, color: 'bg-gray-500' }
    }
  }

  const statusBadge = getStatusBadge()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Subscription Plan
            </CardTitle>
            <CardDescription>
              {subscription.isTrialing && !subscription.hasPaymentMethod
                ? 'Your free trial is active'
                : 'Manage your subscription and billing'}
            </CardDescription>
          </div>
          <Badge className={statusBadge.color}>{statusBadge.text}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan - Compact View */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-1">
            <h3 className="font-semibold text-base">
              {subscription.isTrialing && !subscription.hasPaymentMethod
                ? 'Trial Access'
                : `${subscription.plan.name} Plan`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {subscription.plan.maxLocations === -1 ? 'Unlimited' : subscription.plan.maxLocations}{' '}
              {subscription.plan.maxLocations === 1 ? 'location' : 'locations'} •{' '}
              {subscription.plan.maxMenusPerLocation === -1
                ? 'Unlimited'
                : subscription.plan.maxMenusPerLocation}{' '}
              menus
            </p>
          </div>
          {subscription.hasPaymentMethod && (
            <div className="text-right">
              <p className="text-lg font-semibold">${subscription.plan.monthlyPrice}</p>
              <p className="text-xs text-muted-foreground">per {subscription.billingInterval.toLowerCase()}</p>
            </div>
          )}
        </div>

        {/* Key Info - Compact Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {subscription.hasPaymentMethod && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Billing</p>
                <p className="font-medium">{subscription.billingInterval}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">
                {subscription.isTrialing ? 'Trial Ends' : 'Next Billing'}
              </p>
              <p className="font-medium">
                {subscription.isTrialing
                  ? subscription.trialEndDate
                    ? new Date(subscription.trialEndDate).toLocaleDateString()
                    : 'N/A'
                  : subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Trial Banner - Compact */}
        {subscription.isTrialing && !subscription.hasPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Free Trial:</strong> No payment required until{' '}
              {subscription.trialEndDate
                ? new Date(subscription.trialEndDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        )}

        {subscription.isTrialing && subscription.hasPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Trial Period:</strong> Billing starts on{' '}
              {subscription.trialEndDate
                ? new Date(subscription.trialEndDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {subscription.hasPaymentMethod ? (
            <>
              <Button onClick={() => router.push('/subscription')} variant="default" size="sm">
                Change Plan
              </Button>
              <Button onClick={() => router.push('/subscription')} variant="outline" size="sm">
                Manage Billing
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push('/subscription')} variant="default" size="sm">
              Choose a Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
