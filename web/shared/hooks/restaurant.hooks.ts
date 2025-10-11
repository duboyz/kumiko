import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { restaurantApi } from '../api'
import {
  CreateRestaurantCommand,
  CreateRestaurantResult,
  UpdateRestaurantCommand,
  GetUserRestaurantsResult,
  GetUserRestaurantsParams,
} from '../types'

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRestaurantCommand) => restaurantApi.createRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['user-restaurants'] })
    },
  })
}

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateRestaurantCommand) => restaurantApi.updateRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['user-restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['selectedLocation'] })
    },
  })
}

export const useUserRestaurants = (params?: GetUserRestaurantsParams) => {
  return useQuery({
    queryKey: ['user-restaurants', params],
    queryFn: () => restaurantApi.getUserRestaurants(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
