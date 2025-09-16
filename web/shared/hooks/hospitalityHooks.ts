import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hospitalityApi } from '@shared';
import type { CreateHospitalityCommand } from '@shared';

// Query keys
export const hospitalityKeys = {
  all: ['hospitalities'] as const,
  user: () => [...hospitalityKeys.all, 'user'] as const,
};

// Get user hospitalities hook
export const useUserHospitalities = () => {
  return useQuery({
    queryKey: hospitalityKeys.user(),
    queryFn: async () => {
      const response = await hospitalityApi.getUserHospitalities();
      return response.data;
    },
  });
};

// Create hospitality hook
export const useCreateHospitality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: CreateHospitalityCommand) => {
      const response = await hospitalityApi.createHospitality(command);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch hospitality queries
      queryClient.invalidateQueries({ queryKey: hospitalityKeys.all });
    },
  });
};