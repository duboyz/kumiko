import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api'
import type { CreateOrderCommand } from '../types'

export const useCreateOrder = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateOrderCommand) => orderApi.createOrder(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to create order:', error)
    },
  })
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getOrders(),
  })
}
