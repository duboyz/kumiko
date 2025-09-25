import type {
  CreateWebsitePageCommand,
  CreateWebsitePageResult,
  GetWebsitePagesResult,
  ApiResponse,
  ResponseData,
} from '../types'
import apiClient from './client'

export const pageApi = {
  createPage: async (command: CreateWebsitePageCommand): Promise<ResponseData<CreateWebsitePageResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateWebsitePageResult>>('/api/page/create', command)
    if (!data.success) throw new Error(data.message || 'Failed to create page')
    return data.data
  },

  getPages: async (websiteId: string): Promise<ResponseData<GetWebsitePagesResult>> => {
    const { data } = await apiClient.get<ApiResponse<GetWebsitePagesResult>>(`/api/page/list?websiteId=${websiteId}`)
    if (!data.success) throw new Error(data.message || 'Failed to get pages')
    return data.data
  },
}
