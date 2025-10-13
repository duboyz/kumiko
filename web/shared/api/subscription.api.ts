import { apiClient } from './client'
import type { ApiResponse, ResponseData } from '../types/apiResponse.types'
import type {
  GetSubscriptionPlansResult,
  CreateCheckoutSessionCommand,
  CreateCheckoutSessionResult,
  GetUserSubscriptionResult,
  CancelSubscriptionResult,
} from '../types/subscription.types'

export const subscriptionApi = {
  /**
   * Get all available subscription plans
   */
  getSubscriptionPlans: async (): Promise<ResponseData<GetSubscriptionPlansResult>> => {
    const { data: response } = await apiClient.get<ApiResponse<GetSubscriptionPlansResult>>('/api/subscriptions/plans')
    if (!response.success) throw new Error(response.message || 'Failed to get subscription plans')
    return response.data
  },

  /**
   * Create a Stripe checkout session for subscribing to a plan
   */
  createCheckoutSession: async (
    command: CreateCheckoutSessionCommand
  ): Promise<ResponseData<CreateCheckoutSessionResult>> => {
    const { data: response } = await apiClient.post<ApiResponse<CreateCheckoutSessionResult>>(
      '/api/subscriptions/checkout',
      command
    )
    if (!response.success) throw new Error(response.message || 'Failed to create checkout session')
    return response.data
  },

  /**
   * Get the current user's subscription
   */
  getUserSubscription: async (): Promise<ResponseData<GetUserSubscriptionResult>> => {
    const { data: response } = await apiClient.get<ApiResponse<GetUserSubscriptionResult>>('/api/subscriptions/me')
    if (!response.success) throw new Error(response.message || 'Failed to get user subscription')
    return response.data
  },

  /**
   * Cancel the current user's subscription
   */
  cancelSubscription: async (): Promise<ResponseData<CancelSubscriptionResult>> => {
    const { data: response } = await apiClient.post<ApiResponse<CancelSubscriptionResult>>('/api/subscriptions/cancel')
    if (!response.success) throw new Error(response.message || 'Failed to cancel subscription')
    return response.data
  },
}
