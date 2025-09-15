import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { restaurantApi } from '../api'
import { CreateRestaurantCommand, CreateRestaurantResult, GetUserRestaurantsResult, GetUserRestaurantsParams } from '../types'

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateRestaurantResult, Error, CreateRestaurantCommand>({
    mutationFn: restaurantApi.createRestaurant,
    onSuccess: () => {
      // Invalidate any restaurant-related queries when a new restaurant is created
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['user-restaurants'] })
    }
  })
}

export const useUserRestaurants = (params?: GetUserRestaurantsParams) => {
  return useQuery<GetUserRestaurantsResult, Error>({
    queryKey: ['user-restaurants', params],
    queryFn: () => restaurantApi.getUserRestaurants(params)
  })
}