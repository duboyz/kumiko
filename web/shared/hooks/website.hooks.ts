import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { websiteApi } from '../api'
import type { CreateWebsiteCommand, UpdateWebsiteCommand } from '../types'

export const useRestaurantWebsites = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['restaurant-websites', entityId, entityType],
    queryFn: () => websiteApi.getRestaurantWebsites(entityId, entityType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!entityId, // Only run query when entityId exists
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

export const useWebsiteBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['website-by-subdomain', subdomain],
    queryFn: () => websiteApi.getWebsiteBySubdomain(subdomain),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!subdomain,
  })
}

export const useUpdateWebsite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ websiteId, updates }: { websiteId: string; updates: UpdateWebsiteCommand }) =>
      websiteApi.updateWebsite(websiteId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-websites'] })
      queryClient.invalidateQueries({ queryKey: ['website-by-subdomain'] })
    },
  })
}
