import { apiClient } from './client'
import { RequestSearchAddress, SearchBusinessResult, ApiResponse } from '../types'

export const searchApi = {
  searchBusiness: async (data: RequestSearchAddress): Promise<SearchBusinessResult> => {
    const response = await apiClient.post<ApiResponse<SearchBusinessResult>>('/search/businesses', data)
    if (!response.data.data) {
      throw new Error('No data returned from server')
    }
    return response.data.data
  }
}