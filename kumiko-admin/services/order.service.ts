import { apiClient } from './api.service'
import { GetRestaurantOrdersResult, UpdateOrderStatusResult } from '@/types/order.types'
import { ApiResponse } from '@/types/auth.types'

export const orderService = {
  async getRestaurantOrders(restaurantId: string): Promise<GetRestaurantOrdersResult> {
    const { data } = await apiClient.get<ApiResponse<GetRestaurantOrdersResult>>(
      `/api/orders/restaurant/${restaurantId}`
    )

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch orders')
    }

    return data.data
  },

  async updateOrderStatus(orderId: string, status: string): Promise<UpdateOrderStatusResult> {
    const { data } = await apiClient.patch<ApiResponse<UpdateOrderStatusResult>>(
      `/api/orders/${orderId}/status`,
      { status }
    )

    if (!data.success) {
      throw new Error(data.message || 'Failed to update order status')
    }

    return data.data
  },
}
