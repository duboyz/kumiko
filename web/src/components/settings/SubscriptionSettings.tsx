'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserSubscription } from '@shared/hooks/subscription.hooks'
import { LoadingSpinner } from '@/components'
import { useRouter } from 'next/navigation'
import { Crown, Calendar, CreditCard } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function SubscriptionSettings() {
  const t = useTranslations('settings.subscription')
  const router = useRouter()
  const { data: result, isLoading } = useUserSubscription()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('manageDescription')}</CardDescription>
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
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('noActiveSubscription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t('subscribePrompt')}
          </p>
          <Button onClick={() => router.push('/subscription')}>{t('viewPlans')}</Button>
        </CardContent>
      </Card>
    )
  }

  const subscription = result.subscription

  const getStatusBadge = () => {
    if (subscription.isTrialing && !subscription.hasPaymentMethod) {
      return { text: t('status.freeTrial'), color: 'bg-blue-500' }
    }
    if (subscription.isTrialing && subscription.hasPaymentMethod) {
      return { text: t('status.trialPeriod'), color: 'bg-blue-500' }
    }
    switch (subscription.status) {
      case 'Active':
        return { text: t('status.active'), color: 'bg-green-500' }
      case 'Canceled':
        return { text: t('status.canceled'), color: 'bg-yellow-500' }
      case 'PastDue':
        return { text: t('status.pastDue'), color: 'bg-red-500' }
      case 'Expired':
        return { text: t('status.expired'), color: 'bg-gray-500' }
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
              {t('title')}
            </CardTitle>
            <CardDescription>
              {subscription.isTrialing && !subscription.hasPaymentMethod
                ? t('freeTrialActive')
                : t('manageDescription')}
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
                ? t('trialAccess')
                : t('planName', { name: subscription.plan.name })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {subscription.plan.maxLocations === -1 ? t('unlimited') : subscription.plan.maxLocations}{' '}
              {subscription.plan.maxLocations === 1 ? t('location') : t('locations')} •{' '}
              {subscription.plan.maxMenusPerLocation === -1
                ? t('unlimited')
                : subscription.plan.maxMenusPerLocation}{' '}
              {t('menus')}
            </p>
          </div>
          {subscription.hasPaymentMethod && (
            <div className="text-right">
              <p className="text-lg font-semibold">${subscription.plan.monthlyPrice}</p>
              <p className="text-xs text-muted-foreground">{t('perInterval', { interval: subscription.billingInterval.toLowerCase() })}</p>
            </div>
          )}
        </div>

        {/* Key Info - Compact Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {subscription.hasPaymentMethod && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{t('billing')}</p>
                <p className="font-medium">{subscription.billingInterval}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">
                {subscription.isTrialing ? t('trialEnds') : t('nextBilling')}
              </p>
              <p className="font-medium">
                {subscription.isTrialing
                  ? subscription.trialEndDate
                    ? new Date(subscription.trialEndDate).toLocaleDateString()
                    : t('notAvailable')
                  : subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : t('notAvailable')}
              </p>
            </div>
          </div>
        </div>

        {/* Trial Banner - Compact */}
        {subscription.isTrialing && !subscription.hasPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>{t('freeTrialLabel')}:</strong> {t('freeTrialMessage', {
                date: subscription.trialEndDate
                  ? new Date(subscription.trialEndDate).toLocaleDateString()
                  : t('notAvailable')
              })}
            </p>
          </div>
        )}

        {subscription.isTrialing && subscription.hasPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>{t('trialPeriodLabel')}:</strong> {t('trialPeriodMessage', {
                date: subscription.trialEndDate
                  ? new Date(subscription.trialEndDate).toLocaleDateString()
                  : t('notAvailable')
              })}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {subscription.hasPaymentMethod ? (
            <>
              <Button onClick={() => router.push('/subscription')} variant="default" size="sm">
                {t('changePlan')}
              </Button>
              <Button onClick={() => router.push('/subscription')} variant="outline" size="sm">
                {t('manageBilling')}
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push('/subscription')} variant="default" size="sm">
              {t('choosePlan')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
