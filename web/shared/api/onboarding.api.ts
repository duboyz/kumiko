import { AutoGenerateWebsiteCommand, AutoGenerateWebsiteResult } from '../types/onboarding.types'
import { ApiResponse, ResponseData } from '../types'
import apiClient from './client'

export const onboardingApi = {
  // Auto-generate website from restaurant data
  autoGenerateWebsite: async (
    command: AutoGenerateWebsiteCommand
  ): Promise<ResponseData<AutoGenerateWebsiteResult>> => {
    const { data } = await apiClient.post<ApiResponse<AutoGenerateWebsiteResult>>(
      '/api/onboarding/auto-generate-website',
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to auto-generate website')
    return data.data
  },
}
