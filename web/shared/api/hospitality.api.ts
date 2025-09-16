import type {
  CreateHospitalityCommand,
  CreateHospitalityResult,
  GetUserHospitalitiesResult,
  ApiResponse,
  ResponseData
} from '@shared';
import apiClient from './client';

export const hospitalityApi = {
  createHospitality: async (command: CreateHospitalityCommand): Promise<ResponseData<CreateHospitalityResult>> => {
    const { data } = await apiClient.post<ApiResponse<CreateHospitalityResult>>('/api/hospitality/create', command);
    if (!data.success) throw new Error(data.message || 'Failed to create hospitality');
    return data.data;
  },

  getUserHospitalities: async (): Promise<ResponseData<GetUserHospitalitiesResult>> => {
    const { data } = await apiClient.get<ApiResponse<GetUserHospitalitiesResult>>('/api/hospitality/list');
    if (!data.success) throw new Error(data.message || 'Failed to get user hospitalities');
    return data.data;
  },
};