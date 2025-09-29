import {
  ParsedMenuStructure,
  CreateMenuStructureRequest,
  CreateMenuStructureResponse,
} from '../types/menu-structure.types'
import { apiClient } from './client'

export async function parseMenuStructure(
  imageFile: File,
  annotations?: any[],
  restaurantId?: string
): Promise<ParsedMenuStructure> {
  const formData = new FormData()
  formData.append('image', imageFile)

  if (restaurantId) {
    formData.append('restaurantId', restaurantId)
  }

  if (annotations && annotations.length > 0) {
    formData.append('annotations', JSON.stringify(annotations))
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5158'
  const response = await fetch(`${API_BASE_URL}api/menu-import/parse-image`, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type, let the browser set it with boundary for FormData
    },
    credentials: 'include', // Include cookies for authentication
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to parse menu structure')
  }

  const result = await response.json()
  return result.data // Backend returns { success: true, data: ParsedMenuStructure }
}

export async function createMenuStructure(request: CreateMenuStructureRequest): Promise<CreateMenuStructureResponse> {
  const response = await apiClient.post<CreateMenuStructureResponse>('/api/restaurant-menu/create-structure', request)

  return response.data
}
