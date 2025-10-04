import client from './client'
import {
  CreateOrderCommand,
  CreateOrderResult,
  GetRestaurantOrdersResult,
  UpdateOrderStatusCommand,
  UpdateOrderStatusResult,
  OrderDto,
} from '../types/order.types'
import { ApiResponse, ResponseData } from '../types/apiResponse.types'

export const orderApi = {
  createOrder: async (data: CreateOrderCommand): Promise<ResponseData<CreateOrderResult>> => {
    const { data: response } = await client.post<ApiResponse<CreateOrderResult>>('/api/orders', data)
    if (!response.success || !response.data) throw new Error(response.message || 'Failed to create order')
    return response.data
  },

  getRestaurantOrders: async (restaurantId: string): Promise<ResponseData<OrderDto[]>> => {
    const { data: response } = await client.get<ApiResponse<GetRestaurantOrdersResult>>(
      `/api/orders/restaurant/${restaurantId}`
    )
    if (!response.success || !response.data) throw new Error(response.message || 'Failed to get restaurant orders')
    return response.data.orders
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<ResponseData<UpdateOrderStatusResult>> => {
    const { data: response } = await client.patch<ApiResponse<UpdateOrderStatusResult>>(
      `/api/orders/${orderId}/status`,
      { status }
    )
    if (!response.success || !response.data) throw new Error(response.message || 'Failed to update order status')
    return response.data
  },
}

