import {
  CreateWebsiteFromTemplatesCommand,
  CreateWebsiteFromTemplatesResult,
  ApiResponse,
  ResponseData,
} from '../types'
import apiClient from './client'

export const websiteTemplateApi = {
  createWebsiteFromTemplates: async (
    data: CreateWebsiteFromTemplatesCommand
  ): Promise<ResponseData<CreateWebsiteFromTemplatesResult>> => {
    const { data: response } = await apiClient.post<ApiResponse<CreateWebsiteFromTemplatesResult>>(
      '/api/websites/create-from-templates',
      data
    )
    if (!response.success) throw new Error(response.message || 'Failed to create website from templates')
    return response.data
  },
}

