import { apiClient } from './api.service'
import {
  GetUserRestaurantsResult,
  GetUserRestaurantsQuery,
} from '@/types/restaurant.types'
import { ApiResponse } from '@/types/auth.types'

export const restaurantService = {
  async getUserRestaurants(
    query?: GetUserRestaurantsQuery
  ): Promise<GetUserRestaurantsResult> {
    const params = query?.roles ? { roles: query.roles } : {}

    const { data } = await apiClient.get<ApiResponse<GetUserRestaurantsResult>>(
      '/api/restaurants/user',
      { params }
    )

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch restaurants')
    }

    return data.data
  },
}
