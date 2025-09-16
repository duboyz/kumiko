import { apiClient } from './client';
import type {
  CreateHospitalityCommand,
  CreateHospitalityResult,
  GetUserHospitalitiesResult,
  ApiResponse
} from '@shared';

export const hospitalityApi = {
  createHospitality: async (command: CreateHospitalityCommand): Promise<ApiResponse<CreateHospitalityResult>> => {
    const response = await apiClient.post('/api/hospitality/create', command);
    return response.data;
  },

  getUserHospitalities: async (): Promise<ApiResponse<GetUserHospitalitiesResult>> => {
    const response = await apiClient.get('/api/hospitality/list');
    return response.data;
  },
};