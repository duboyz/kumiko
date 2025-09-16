import { apiClient } from './client'
import { CreateRestaurantCommand, CreateRestaurantResult, GetUserRestaurantsResult, GetUserRestaurantsParams, ApiResponse } from '../types'

export const restaurantApi = {
  createRestaurant: async (data: CreateRestaurantCommand): Promise<CreateRestaurantResult> => {
    const response = await apiClient.post<ApiResponse<CreateRestaurantResult>>('/api/restaurants', data)
    if (!response.data.data) {
      throw new Error('No data returned from server')
    }
    return response.data.data
  },

  getUserRestaurants: async (params?: GetUserRestaurantsParams): Promise<GetUserRestaurantsResult> => {
    const queryParams = params?.roles ? { roles: params.roles } : {}
    const response = await apiClient.get<ApiResponse<GetUserRestaurantsResult>>('/api/restaurants/user', { params: queryParams })
    if (!response.data.data) {
      throw new Error('No data returned from server')
    }
    return response.data.data
  }
}