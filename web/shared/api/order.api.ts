import axios from 'axios'
import client from './client'
import {
  CreateOrderCommand,
  CreateOrderResult,
  CreateCheckoutSessionResult,
  GetRestaurantOrdersResult,
  UpdateOrderStatusCommand,
  UpdateOrderStatusResult,
  OrderDto,
  GetOrderByIdResult,
  CustomerOrderDto,
} from '../types/order.types'
import { ApiResponse, ResponseData } from '../types/apiResponse.types'

export const orderApi = {
  createOrder: async (data: CreateOrderCommand): Promise<ResponseData<CreateOrderResult>> => {
    try {
      const { data: response } = await client.post<ApiResponse<CreateOrderResult>>('/api/orders', data)
      if (!response.success || !response.data) throw new Error(response.message || 'Failed to create order')
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        throw new Error('Too many orders. Please wait a minute and try again.')
      }
      throw err
    }
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

  getOrderById: async (orderId: string): Promise<ResponseData<GetOrderByIdResult>> => {
    const { data: response } = await client.get<ApiResponse<GetOrderByIdResult>>(`/api/orders/${orderId}/status`)
    if (!response.success || !response.data) throw new Error(response.message || 'Failed to get order')
    return response.data
  },

  getCustomerOrders: async (): Promise<ResponseData<CustomerOrderDto[]>> => {
    const { data: response } = await client.get<ApiResponse<CustomerOrderDto[]>>('/api/orders/my-orders')
    if (!response.success || !response.data) throw new Error(response.message || 'Failed to get customer orders')
    return response.data
  },

  createCheckoutSession: async (orderId: string): Promise<CreateCheckoutSessionResult> => {
    const { data: response } = await client.post<ApiResponse<CreateCheckoutSessionResult>>(
      `/api/orders/${orderId}/checkout-session`
    )
    if (!response.success || !response.data) throw new Error(response.message || 'Failed to create checkout session')
    return response.data
  },
}
