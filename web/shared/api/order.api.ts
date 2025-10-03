import type { CreateOrderCommand, CreateOrderResult, GetOrdersResult, ApiResponse, ResponseData } from '../types'
import apiClient from './client'

export const orderApi = {
  createOrder: async (command: CreateOrderCommand): Promise<ResponseData<CreateOrderResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateOrderResult>>('/api/orders', command)
    if (!data.success) throw new Error(data.message || 'Failed to create order')
    return data.data
  },

  getOrders: async (): Promise<ResponseData<GetOrdersResult>> => {
    const { data } = await apiClient.get<ApiResponse<GetOrdersResult>>('/api/orders')
    if (!data.success) throw new Error(data.message || 'Failed to fetch orders')
    return data.data
  },
}
