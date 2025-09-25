import {
  CreateRestaurantCommand,
  CreateRestaurantResult,
  GetUserRestaurantsResult,
  GetUserRestaurantsParams,
  ApiResponse,
  ResponseData,
} from '../types'
import apiClient from './client'

export const restaurantApi = {
  createRestaurant: async (data: CreateRestaurantCommand): Promise<ResponseData<CreateRestaurantResult>> => {
    const { data: response } = await apiClient.post<ApiResponse<CreateRestaurantResult>>('/api/restaurants', data)
    if (!response.success) throw new Error(response.message || 'Failed to create restaurant')
    return response.data
  },
  getUserRestaurants: async (params?: GetUserRestaurantsParams): Promise<ResponseData<GetUserRestaurantsResult>> => {
    const queryParams = params?.roles ? { roles: params.roles } : {}
    const { data: response } = await apiClient.get<ApiResponse<GetUserRestaurantsResult>>('/api/restaurants/user', {
      params: queryParams,
    })
    if (!response.success) throw new Error(response.message || 'Failed to get user restaurants')
    return response.data
  },
}
