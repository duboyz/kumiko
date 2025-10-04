import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/order.api'
import { CreateOrderCommand } from '../types/order.types'

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderCommand) => orderApi.createOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['restaurant-orders', variables.restaurantId],
      })
    },
  })
}

// Get restaurant orders
export const useRestaurantOrders = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-orders', restaurantId],
    queryFn: () => orderApi.getRestaurantOrders(restaurantId),
    enabled: !!restaurantId,
  })
}

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['restaurant-orders'],
      })
    },
  })
}

