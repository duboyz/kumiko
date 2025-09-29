import {
  ParsedMenuStructure,
  CreateMenuStructureRequest,
  CreateMenuStructureResponse,
} from '../types/menu-structure.types'
import { apiClient } from './client'

export async function parseMenuStructure(imageFile: File, restaurantId: string, annotations?: any[]): Promise<ParsedMenuStructure> {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('restaurantId', restaurantId)

  if (annotations && annotations.length > 0) {
    formData.append('annotations', JSON.stringify(annotations))
  }

  const response = await apiClient.post('/api/restaurant-menu/parse-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to parse menu structure')
  }

  // Map backend response to frontend structure
  const backendData = response.data.data
  return {
    categories: backendData.categories.map((cat: any) => ({
      name: cat.name,
      description: cat.description,
      orderIndex: cat.orderIndex,
      items: cat.items.map((item: any) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        orderIndex: item.orderIndex,
      })),
    })),
    suggestedMenuName: backendData.menuName,
    suggestedMenuDescription: backendData.menuDescription,
    menuId: backendData.menuId, // Add the created menu ID
  }
}

export async function createMenuStructure(request: CreateMenuStructureRequest): Promise<CreateMenuStructureResponse> {
  const response = await apiClient.post<CreateMenuStructureResponse>('/api/restaurant-menu/create-structure', request)

  return response.data
}
