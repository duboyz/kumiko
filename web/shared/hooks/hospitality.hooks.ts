import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hospitalityApi } from '../api'
import type { CreateHospitalityCommand } from '../types'

export const useUserHospitalities = () => {
  return useQuery({
    queryKey: ['user-hospitalities'],
    queryFn: () => hospitalityApi.getUserHospitalities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateHospitality = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateHospitalityCommand) => hospitalityApi.createHospitality(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-hospitalities'] })
    },
  })
}
