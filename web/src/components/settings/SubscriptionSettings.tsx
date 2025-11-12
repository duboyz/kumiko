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
      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-semibold text-lg">
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
              menus per location
            </p>
          </div>
        </div>

        {/* Billing Info */}
        {subscription.hasPaymentMethod ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Billing Interval</p>
                <p className="text-sm text-muted-foreground">{subscription.billingInterval}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {subscription.isTrialing ? 'Trial Ends' : 'Next Billing'}
                </p>
                <p className="text-sm text-muted-foreground">
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
        ) : (
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Trial Ends</p>
              <p className="text-sm text-muted-foreground">
                {subscription.trialEndDate
                  ? new Date(subscription.trialEndDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Trial Banner - Only show if no payment method */}
        {subscription.isTrialing && !subscription.hasPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Free Trial Active!</strong>
            </p>
            <p className="text-sm text-blue-900">
              You're enjoying a 14-day free trial. <strong>No payment required</strong> until{' '}
              {subscription.trialEndDate
                ? new Date(subscription.trialEndDate).toLocaleDateString()
                : 'N/A'}
              . To continue using the service after your trial, choose a plan and set up payment.
            </p>
          </div>
        )}

        {/* Paid Trial Banner - Has payment method */}
        {subscription.isTrialing && subscription.hasPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Trial Period!</strong> Your trial ends on{' '}
              {subscription.trialEndDate
                ? new Date(subscription.trialEndDate).toLocaleDateString()
                : 'N/A'}
              . After that, you'll be charged ${subscription.plan.monthlyPrice}/month.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {subscription.hasPaymentMethod ? (
            <>
              <Button onClick={() => router.push('/subscription')} variant="default">
                Change Plan
              </Button>
              <Button onClick={() => router.push('/subscription')} variant="outline">
                Manage Subscription
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push('/subscription')} variant="default">
              Choose a Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
