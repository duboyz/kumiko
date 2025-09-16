import { apiClient } from './client'
import type {
  CreateHeroSectionCommand,
  CreateHeroSectionResult,
  UpdateHeroSectionCommand,
  UpdateHeroSectionResult,
  CreateTextSectionCommand,
  CreateTextSectionResult,
  UpdateTextSectionCommand,
  UpdateTextSectionResult,
  ApiResponse
} from '../types'

export const sectionApi = {
  createHeroSection: async (command: CreateHeroSectionCommand): Promise<ApiResponse<CreateHeroSectionResult>> => {
    const response = await apiClient.post('/api/section/hero', command)
    return response.data
  },

  updateHeroSection: async (heroSectionId: string, command: UpdateHeroSectionCommand): Promise<ApiResponse<UpdateHeroSectionResult>> => {
    const response = await apiClient.put(`/api/section/hero/${heroSectionId}`, command)
    return response.data
  },

  createTextSection: async (command: CreateTextSectionCommand): Promise<ApiResponse<CreateTextSectionResult>> => {
    const response = await apiClient.post('/api/section/text', command)
    return response.data
  },

  updateTextSection: async (textSectionId: string, command: UpdateTextSectionCommand): Promise<ApiResponse<UpdateTextSectionResult>> => {
    const response = await apiClient.put(`/api/section/text/${textSectionId}`, command)
    return response.data
  }
}