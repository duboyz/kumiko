import { useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '../api'
import { UpdateUserSettingsCommand, UpdateRestaurantSettingsCommand, UpdateHospitalitySettingsCommand } from '../types'

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: UpdateUserSettingsCommand) => settingsApi.updateUserSettings(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export const useUpdateRestaurantSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantId, command }: { restaurantId: string; command: UpdateRestaurantSettingsCommand }) =>
      settingsApi.updateRestaurantSettings(restaurantId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['userRestaurants'] })
    },
  })
}

export const useUpdateHospitalitySettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ hospitalityId, command }: { hospitalityId: string; command: UpdateHospitalitySettingsCommand }) =>
      settingsApi.updateHospitalitySettings(hospitalityId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalities'] })
      queryClient.invalidateQueries({ queryKey: ['userHospitalities'] })
    },
  })
}