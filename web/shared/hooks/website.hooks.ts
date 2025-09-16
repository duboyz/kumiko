import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { websiteApi } from '../api'
import type { CreateWebsiteCommand } from '../types'

export const useRestaurantWebsites = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['restaurant-websites', entityId, entityType],
    queryFn: () => websiteApi.getRestaurantWebsites(entityId, entityType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateWebsite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateWebsiteCommand) => websiteApi.createWebsite(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-websites'] })
    },
  })
}