'use client'

import { useState } from 'react'
import { useUserSubscription, useSubscriptionPlans, useCreateCheckoutSession, useCancelSubscription } from '@shared/hooks/subscription.hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PricingCard } from '@/stories/subscriptions/PricingCard/PricingCard'
import { SubscriptionStatus } from '@/stories/subscriptions/SubscriptionStatus/SubscriptionStatus'
import { LoadingSpinner } from '@/components'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function SubscriptionPage() {
  const t = useTranslations('subscription')
  const [billingInterval, setBillingInterval] = useState<'Monthly' | 'Yearly'>('Monthly')
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const { data: subscription, isLoading: subLoading } = useUserSubscription()
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans()
  const createCheckout = useCreateCheckoutSession()
  const cancelSubscription = useCancelSubscription()

  const handleSelectPlan = async (planId: string) => {
    try {
      await createCheckout.mutateAsync({
        subscriptionPlanId: planId,
        billingInterval,
      })
    } catch (error) {
      toast.error(t('failedToCreateCheckout'))
    }
  }

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription.mutateAsync()
      if (result) {
        toast.success(result.message)
      }
      setShowCancelDialog(false)
    } catch (error) {
      toast.error(t('failedToCancel'))
    }
  }

  if (subLoading || plansLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const userSubscription = subscription?.subscription

  // Only show a plan as "current" if they have payment method set up
  // Free trial users without payment haven't actually chosen a plan yet
  const currentPlanId =
    userSubscription && userSubscription.hasPaymentMethod
      ? userSubscription.plan.id
      : null

  // Mock usage data - in production, fetch from API
  const currentLocations = 1
  const currentMenus = 2

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">
          {userSubscription && userSubscription.isTrialing && !userSubscription.hasPaymentMethod
            ? t('chooseYourPlan')
            : t('subscriptionManagement')}
        </h1>
        <p className="text-muted-foreground">
          {userSubscription && userSubscription.isTrialing && !userSubscription.hasPaymentMethod
            ? t('selectPlan')
            : t('manageBilling')}
        </p>
      </div>

      {/* Free Trial Banner */}
      {userSubscription && userSubscription.isTrialing && !userSubscription.hasPaymentMethod && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-semibold text-blue-900">{t('freeTrialActive')}</h3>
                <p className="mt-1 text-sm text-blue-800">
                  {t('freeTrialMessage', {
                    date: userSubscription.trialEndDate
                      ? new Date(userSubscription.trialEndDate).toLocaleDateString()
                      : 'N/A'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Subscription Status - Only show if they have payment method */}
      {userSubscription && userSubscription.hasPaymentMethod && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {userSubscription.isTrialing ? t('trialSubscription') : t('currentSubscription')}
          </h2>
          <SubscriptionStatus
            subscription={userSubscription}
            currentLocations={currentLocations}
            currentMenus={currentMenus}
          />

          {/* Only show cancel button if they have an active paid subscription */}
          {userSubscription.isActive && (
            <Card>
              <CardHeader>
                <CardTitle>{t('manageSubscription')}</CardTitle>
                <CardDescription>{t('cancelOrModify')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                  {t('cancelSubscription')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {userSubscription && userSubscription.isTrialing && !userSubscription.hasPaymentMethod
            ? t('availablePlans')
            : userSubscription
              ? t('upgradeOrChangePlan')
              : t('choosePlan')}
        </h2>

        <Tabs value={billingInterval} onValueChange={(v) => setBillingInterval(v as 'Monthly' | 'Yearly')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="Monthly">{t('monthly')}</TabsTrigger>
            <TabsTrigger value="Yearly">
              {t('yearly')}
              <span className="ml-2 text-xs text-green-600">({t('save17Percent')})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={billingInterval} className="mt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {plans?.plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  billingInterval={billingInterval}
                  isCurrentPlan={currentPlanId === plan.id}
                  isPopular={plan.tier === 'Premium'}
                  onSelect={() => handleSelectPlan(plan.id)}
                  loading={createCheckout.isPending}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('cancelTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('cancelDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('keepSubscription')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending ? t('canceling') : t('cancelSubscription')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
