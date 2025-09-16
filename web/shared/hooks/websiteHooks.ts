import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { websiteApi } from '@shared';
import type { CreateWebsiteCommand } from '@shared';

// Query keys
export const websiteKeys = {
  all: ['websites'] as const,
  restaurants: () => [...websiteKeys.all, 'restaurants'] as const,
};

// Get restaurant websites hook
export const useRestaurantWebsites = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: [...websiteKeys.restaurants(), entityId, entityType],
    queryFn: async () => {
      const response = await websiteApi.getRestaurantWebsites(entityId, entityType);
      return response.data;
    },
  });
};

// Create website hook
export const useCreateWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: CreateWebsiteCommand) => {
      const response = await websiteApi.createWebsite(command);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch website queries
      queryClient.invalidateQueries({ queryKey: websiteKeys.all });
    },
  });
};