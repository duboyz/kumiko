import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from '../api/subscription.api'
import type { CreateCheckoutSessionCommand } from '../types/subscription.types'

/**
 * Hook to get all subscription plans
 */
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => subscriptionApi.getSubscriptionPlans(),
  })
}

/**
 * Hook to create a checkout session and redirect to Stripe
 */
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (command: CreateCheckoutSessionCommand) => subscriptionApi.createCheckoutSession(command),
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl
      }
    },
  })
}

/**
 * Hook to get the current user's subscription
 */
export const useUserSubscription = () => {
  return useQuery({
    queryKey: ['userSubscription'],
    queryFn: () => subscriptionApi.getUserSubscription(),
  })
}

/**
 * Hook to cancel subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => subscriptionApi.cancelSubscription(),
    onSuccess: () => {
      // Invalidate subscription query to refetch updated status
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] })
    },
  })
}

/**
 * Hook to get usage statistics for the current user's subscription
 */
export const useUsageStats = () => {
  return useQuery({
    queryKey: ['usageStats'],
    queryFn: () => subscriptionApi.getUsageStats(),
  })
}
