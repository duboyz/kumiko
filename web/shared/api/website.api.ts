import type {
  CreateWebsiteCommand,
  CreateWebsiteResult,
  GetRestaurantWebsitesResult,
  GetWebsiteBySubdomainResult,
  UpdateWebsiteCommand,
  UpdateWebsiteResult,
  ApiResponse,
  ResponseData,
} from '@shared'
import apiClient from './client'

export const websiteApi = {
  createWebsite: async (command: CreateWebsiteCommand): Promise<ResponseData<CreateWebsiteResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateWebsiteResult>>('/api/website/create', command)
    if (!data.success) throw new Error(data.message || 'Failed to create website')
    return data.data
  },

  getRestaurantWebsites: async (
    entityId?: string,
    entityType?: string
  ): Promise<ResponseData<GetRestaurantWebsitesResult>> => {
    const params = new URLSearchParams()
    if (entityId) params.append('entityId', entityId)
    if (entityType) params.append('entityType', entityType)

    const queryString = params.toString()
    const url = queryString ? `/api/website/list?${queryString}` : '/api/website/list'

    const { data } = await apiClient.get<ApiResponse<GetRestaurantWebsitesResult>>(url)
    if (!data.success) throw new Error(data.message || 'Failed to get restaurant websites')
    return data.data
  },

  getWebsiteBySubdomain: async (subdomain: string): Promise<ResponseData<GetWebsiteBySubdomainResult>> => {
    const { data } = await apiClient.get<ApiResponse<GetWebsiteBySubdomainResult>>(
      `/api/website/by-subdomain/${subdomain}`
    )
    if (!data.success) throw new Error(data.message || 'Failed to get website by subdomain')
    return data.data
  },

  updateWebsite: async (
    websiteId: string,
    command: UpdateWebsiteCommand
  ): Promise<ResponseData<UpdateWebsiteResult>> => {
    const { data } = await apiClient.put<ApiResponse<UpdateWebsiteResult>>(`/api/website/${websiteId}`, command)
    if (!data.success) throw new Error(data.message || 'Failed to update website')
    return data.data
  },
}
