import { apiClient } from './client';
import type {
  CreateWebsiteCommand,
  CreateWebsiteResult,
  GetRestaurantWebsitesResult,
  ApiResponse
} from '@shared';

export const websiteApi = {
  createWebsite: async (command: CreateWebsiteCommand): Promise<ApiResponse<CreateWebsiteResult>> => {
    const response = await apiClient.post('/api/website/create', command);
    return response.data;
  },

  getRestaurantWebsites: async (entityId?: string, entityType?: string): Promise<ApiResponse<GetRestaurantWebsitesResult>> => {
    const params = new URLSearchParams();
    if (entityId) params.append('entityId', entityId);
    if (entityType) params.append('entityType', entityType);

    const queryString = params.toString();
    const url = queryString ? `/api/website/list?${queryString}` : '/api/website/list';

    const response = await apiClient.get(url);
    return response.data;
  },
};