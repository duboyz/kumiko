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

export default function SubscriptionPage() {
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
      toast.error('Failed to create checkout session')
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
      toast.error('Failed to cancel subscription')
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
  const currentPlanId = userSubscription?.plan.id

  // Mock usage data - in production, fetch from API
  const currentLocations = 1
  const currentMenus = 2

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Subscription Status */}
      {userSubscription && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Current Subscription</h2>
          <SubscriptionStatus
            subscription={userSubscription}
            currentLocations={currentLocations}
            currentMenus={currentMenus}
          />

          {userSubscription.isActive && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <CardDescription>Cancel or modify your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                  Cancel Subscription
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {userSubscription ? 'Upgrade or Change Plan' : 'Choose a Plan'}
        </h2>

        <Tabs value={billingInterval} onValueChange={(v) => setBillingInterval(v as 'Monthly' | 'Yearly')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="Monthly">Monthly</TabsTrigger>
            <TabsTrigger value="Yearly">
              Yearly
              <span className="ml-2 text-xs text-green-600">(Save 17%)</span>
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
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending ? 'Canceling...' : 'Cancel Subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
