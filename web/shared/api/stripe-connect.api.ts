import { ApiResponse } from '@shared'
import apiClient, { publicApiClient } from './client'

export interface GetConnectStatusResult {
  isConnected: boolean
  onboardingComplete: boolean
  chargesEnabled: boolean
  accountId: string | null
}

export interface CreateOnboardingLinkResult {
  onboardingUrl: string
}

export const stripeConnectApi = {
  getConnectStatus: async (restaurantId: string): Promise<GetConnectStatusResult> => {
    const { data } = await apiClient.get<ApiResponse<GetConnectStatusResult>>(
      `/api/restaurant/${restaurantId}/stripe-connect/status`
    )
    if (!data.success) {
      throw new Error(data.message || 'Failed to get connect status')
    }
    return data.data!
  },

  createOnboardingLink: async (restaurantId: string): Promise<CreateOnboardingLinkResult> => {
    const { data } = await apiClient.post<ApiResponse<CreateOnboardingLinkResult>>(
      `/api/restaurant/${restaurantId}/stripe-connect/onboarding-link`
    )
    if (!data.success) {
      throw new Error(data.message || 'Failed to create onboarding link')
    }
    return data.data!
  },

  refreshConnectStatus: async (restaurantId: string): Promise<void> => {
    const { data } = await apiClient.post<ApiResponse<{ success: boolean }>>(
      `/api/restaurant/${restaurantId}/stripe-connect/refresh-status`
    )
    if (!data.success) {
      throw new Error(data.message || 'Failed to refresh connect status')
    }
  },

  getPublishableKey: async (): Promise<string> => {
    try {
      const { data } = await publicApiClient.get<ApiResponse<string>>('/api/stripe/publishable-key')
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to get publishable key')
      }
      return data.data
    } catch (error: any) {
      // Enhanced error logging
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data?.message || `Server error: ${error.response.status}`)
      } else if (error.request) {
        // Request made but no response (network error)
        throw new Error('Network error: Unable to reach server. Please check your connection.')
      } else {
        // Something else happened
        throw new Error(error.message || 'Failed to get publishable key')
      }
    }
  },
}

