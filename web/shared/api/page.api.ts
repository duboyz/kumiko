import type {
  CreateWebsitePageCommand,
  CreateWebsitePageResult,
  CreatePageFromTemplateCommand,
  CreatePageFromTemplateResult,
  GetWebsitePagesResult,
  ApiResponse,
  ResponseData,
} from '../types'
import apiClient from './client'

export const pageApi = {
  createPage: async (command: CreateWebsitePageCommand): Promise<ResponseData<CreateWebsitePageResult>> => {
    const { data} = await apiClient.post<ApiResponse<CreateWebsitePageResult>>('/api/page/create', command)
    if (!data.success) throw new Error(data.message || 'Failed to create page')
    return data.data
  },

  createPageFromTemplate: async (
    command: CreatePageFromTemplateCommand
  ): Promise<ResponseData<CreatePageFromTemplateResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreatePageFromTemplateResult>>(
      '/api/website-pages/from-template',
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to create page from template')
    return data.data
  },

  getPages: async (websiteId: string): Promise<ResponseData<GetWebsitePagesResult>> => {
    const { data } = await apiClient.get<ApiResponse<GetWebsitePagesResult>>(`/api/page/list?websiteId=${websiteId}`)
    if (!data.success) throw new Error(data.message || 'Failed to get pages')
    return data.data
  },
}
