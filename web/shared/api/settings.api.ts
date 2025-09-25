import {
  UpdateUserSettingsCommand,
  UpdateRestaurantSettingsCommand,
  UpdateHospitalitySettingsCommand,
  ApiResponse,
} from '@shared'
import apiClient from './client'

export const settingsApi = {
  updateUserSettings: async (command: UpdateUserSettingsCommand): Promise<void> => {
    const { data } = await apiClient.put<ApiResponse<null>>('/api/users/settings', command)
    if (!data.success) {
      throw new Error(data.message || 'Failed to update user settings')
    }
  },

  updateRestaurantSettings: async (restaurantId: string, command: UpdateRestaurantSettingsCommand): Promise<void> => {
    const { data } = await apiClient.put<ApiResponse<null>>(`/api/restaurant/${restaurantId}/settings`, command)
    if (!data.success) {
      throw new Error(data.message || 'Failed to update restaurant settings')
    }
  },

  updateHospitalitySettings: async (
    hospitalityId: string,
    command: UpdateHospitalitySettingsCommand
  ): Promise<void> => {
    const { data } = await apiClient.put<ApiResponse<null>>(`/api/hospitality/${hospitalityId}/settings`, command)
    if (!data.success) {
      throw new Error(data.message || 'Failed to update hospitality settings')
    }
  },
}
