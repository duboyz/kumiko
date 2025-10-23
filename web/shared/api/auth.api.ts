import { LoginRdto, RegisterRdto, AuthSdto, UserSdto, ResponseData, ApiResponse, RefreshTokenResult } from '@shared'
import apiClient from './client'

export const authApi = {
  login: async (credentials: Omit<LoginRdto, 'clientType'>): Promise<ResponseData<AuthSdto>> => {
    const { data } = await apiClient.post<ApiResponse<AuthSdto>>('/api/auth/login', {
      ...credentials,
      clientType: 'Web',
    })
    if (!data.success) throw new Error(data.message || 'Login failed')
    return data.data
  },

  register: async (credentials: Omit<RegisterRdto, 'clientType'>): Promise<ResponseData<AuthSdto>> => {
    const { data } = await apiClient.post<ApiResponse<AuthSdto>>('/api/auth/register', {
      ...credentials,
      clientType: 'Web',
    })
    if (!data.success) throw new Error(data.message || 'Registration failed')
    return data.data
  },

  logout: async (): Promise<void> => {
    const { data } = await apiClient.post<ApiResponse<null>>('/api/auth/logout')
    if (!data.success) {
      throw new Error(data.message || 'Logout failed')
    }
  },

  getCurrentUser: async (): Promise<ResponseData<UserSdto>> => {
    const { data } = await apiClient.get<ApiResponse<UserSdto>>('/api/auth/me')
    if (!data.success) {
      throw new Error(data.message || 'Failed to get current user')
    }
    return data.data
  },

  refresh: async (): Promise<ResponseData<RefreshTokenResult>> => {
    const { data } = await apiClient.post<ApiResponse<RefreshTokenResult>>('/api/auth/refresh', {
      clientType: 'Web',
    })
    if (!data.success) {
      throw new Error(data.message || 'Token refresh failed')
    }
    return data.data
  },
}
