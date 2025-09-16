import { apiClient } from './client'
import type {
  CreateWebsitePageCommand,
  CreateWebsitePageResult,
  GetWebsitePagesResult,
  ApiResponse
} from '../types'

export const pageApi = {
  createPage: async (command: CreateWebsitePageCommand): Promise<ApiResponse<CreateWebsitePageResult>> => {
    const response = await apiClient.post('/api/page/create', command)
    return response.data
  },

  getPages: async (websiteId: string): Promise<ApiResponse<GetWebsitePagesResult>> => {
    const response = await apiClient.get(`/api/page/list?websiteId=${websiteId}`)
    return response.data
  }
}