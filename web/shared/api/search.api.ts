import { RequestSearchAddress, SearchBusinessResult, ApiResponse, ResponseData } from '../types'
import apiClient from './client'

export const searchApi = {
  searchBusiness: async (data: RequestSearchAddress): Promise<ResponseData<SearchBusinessResult>> => {
    const { data: response } = await apiClient.post<ApiResponse<SearchBusinessResult>>('/api/search/businesses', data)
    if (!response.success) throw new Error(response.message || 'Failed to search businesses')
    return response.data
  }
}