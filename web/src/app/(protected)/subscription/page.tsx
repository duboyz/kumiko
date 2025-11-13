'use client'

import { useState } from 'react'
import { useUserSubscription, useSubscriptionPlans, useCreateCheckoutSession, useCancelSubscription, useUsageStats } from '@shared/hooks/subscription.hooks'
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
import { ContentContainer, LoadingSpinner } from '@/components'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function SubscriptionPage() {
  const t = useTranslations('subscription')
  const [billingInterval, setBillingInterval] = useState<'Monthly' | 'Yearly'>('Monthly')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [skipTrial, setSkipTrial] = useState(false)

  const { data: subscription, isLoading: subLoading } = useUserSubscription()
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans()
  const { data: usageStats, isLoading: usageLoading } = useUsageStats()
  const createCheckout = useCreateCheckoutSession()
  const cancelSubscription = useCancelSubscription()

  const handleSelectPlan = async (planId: string) => {
    try {
      await createCheckout.mutateAsync({
        subscriptionPlanId: planId,
        billingInterval,
        skipTrial,
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

  if (subLoading || plansLoading || usageLoading) {
    return (
      <ContentContainer>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </ContentContainer>
    )
  }

  const userSubscription = subscription?.subscription

  // Only show a plan as "current" if they have payment method set up
  // Free trial users without payment haven't actually chosen a plan yet
  const currentPlanId =
    userSubscription && userSubscription.hasPaymentMethod
      ? userSubscription.plan.id
      : null

  // Use real usage data from API
  const currentLocations = usageStats?.currentLocations ?? 0
  const currentMenus = usageStats?.currentMenusPerLocation ?? 0

  return (
    <ContentContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <p>Asset goes here</p>
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
        </div>

        {/* Available Plans */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
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



        {/* Free Trial Banner */}
        {userSubscription && userSubscription.isTrialing && !userSubscription.hasPaymentMethod && (
          <>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div>
                  <h3 className="font-semibold text-blue-900">{t('freeTrialActive')}</h3>
                  <p className="mt-1 text-sm text-blue-800">
                    You have a 14-day free trial ending on{' '}
                    {userSubscription.trialEndDate
                      ? new Date(userSubscription.trialEndDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skip Trial Option */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Start Subscription Now</h4>
                    <p className="text-sm text-muted-foreground">
                      Skip the trial and start your paid subscription immediately
                    </p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={skipTrial}
                      onChange={(e) => setSkipTrial(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Skip trial</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Current Subscription Status - Only show if they have payment method */}
        {userSubscription && userSubscription.hasPaymentMethod && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
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
    </ContentContainer>
  )
}
