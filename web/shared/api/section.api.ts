import type {
  CreateHeroSectionCommand,
  CreateHeroSectionResult,
  UpdateHeroSectionCommand,
  UpdateHeroSectionResult,
  CreateTextSectionCommand,
  CreateTextSectionResult,
  UpdateTextSectionCommand,
  UpdateTextSectionResult,
  CreateRestaurantMenuSectionCommand,
  CreateRestaurantMenuSectionResult,
  UpdateRestaurantMenuSectionCommand,
  UpdateRestaurantMenuSectionResult,
  CreateTextAndImageSectionCommand,
  CreateTextAndImageSectionResult,
  UpdateTextAndImageSectionCommand,
  UpdateTextAndImageSectionResult,
  DeleteSectionCommand,
  DeleteSectionResult,
  ReorderSectionsCommand,
  ReorderSectionsResult,
  ApiResponse,
  ResponseData,
} from '../types'
import apiClient from './client'

export const sectionApi = {
  createHeroSection: async (command: CreateHeroSectionCommand): Promise<ResponseData<CreateHeroSectionResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateHeroSectionResult>>('/api/section/hero', command)
    if (!data.success) throw new Error(data.message || 'Failed to create hero section')
    return data.data
  },

  updateHeroSection: async (
    heroSectionId: string,
    command: UpdateHeroSectionCommand
  ): Promise<ResponseData<UpdateHeroSectionResult>> => {
    const { data } = await apiClient.put<ApiResponse<UpdateHeroSectionResult>>(
      `/api/section/hero/${heroSectionId}`,
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to update hero section')
    return data.data
  },

  createTextSection: async (command: CreateTextSectionCommand): Promise<ResponseData<CreateTextSectionResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateTextSectionResult>>('/api/section/text', command)
    if (!data.success) throw new Error(data.message || 'Failed to create text section')
    return data.data
  },

  updateTextSection: async (
    textSectionId: string,
    command: UpdateTextSectionCommand
  ): Promise<ResponseData<UpdateTextSectionResult>> => {
    const { data } = await apiClient.put<ApiResponse<UpdateTextSectionResult>>(
      `/api/section/text/${textSectionId}`,
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to update text section')
    return data.data
  },

  createRestaurantMenuSection: async (
    command: CreateRestaurantMenuSectionCommand
  ): Promise<ResponseData<CreateRestaurantMenuSectionResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateRestaurantMenuSectionResult>>(
      '/api/section/restaurant-menu',
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to create restaurant menu section')
    return data.data
  },

  updateRestaurantMenuSection: async (
    restaurantMenuSectionId: string,
    command: UpdateRestaurantMenuSectionCommand
  ): Promise<ResponseData<UpdateRestaurantMenuSectionResult>> => {
    const { data } = await apiClient.put<ApiResponse<UpdateRestaurantMenuSectionResult>>(
      `/api/section/restaurant-menu/${restaurantMenuSectionId}`,
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to update restaurant menu section')
    return data.data
  },

  createTextAndImageSection: async (
    command: CreateTextAndImageSectionCommand
  ): Promise<ResponseData<CreateTextAndImageSectionResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateTextAndImageSectionResult>>(
      '/api/section/text-and-image',
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to create text and image section')
    return data.data
  },

  updateTextAndImageSection: async (
    textAndImageSectionId: string,
    command: UpdateTextAndImageSectionCommand
  ): Promise<ResponseData<UpdateTextAndImageSectionResult>> => {
    const { data } = await apiClient.put<ApiResponse<UpdateTextAndImageSectionResult>>(
      `/api/section/text-and-image/${textAndImageSectionId}`,
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to update text and image section')
    return data.data
  },

  deleteSection: async (sectionId: string): Promise<ResponseData<DeleteSectionResult>> => {
    const { data } = await apiClient.delete<ApiResponse<DeleteSectionResult>>(`/api/website-sections/${sectionId}`)
    if (!data.success) throw new Error(data.message || 'Failed to delete section')
    return data.data
  },

  reorderSections: async (command: ReorderSectionsCommand): Promise<ResponseData<ReorderSectionsResult>> => {
    const { data } = await apiClient.post<ApiResponse<ReorderSectionsResult>>(
      '/api/website-sections/reorder',
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to reorder sections')
    return data.data
  },
}
