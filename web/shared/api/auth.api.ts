import { LoginRdto, RegisterRdto, AuthSdto, UserSdto, ResponseData, ApiResponse, RefreshTokenResult } from '@shared'
import type { ForgotPasswordCommand, ForgotPasswordResult, ResetPasswordCommand, ResetPasswordResult, RegisterCustomerCommand, RegisterCustomerResult } from '../types/auth.types'
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

  registerCustomer: async (credentials: Omit<RegisterCustomerCommand, 'clientType'>): Promise<ResponseData<RegisterCustomerResult>> => {
    const { data } = await apiClient.post<ApiResponse<RegisterCustomerResult>>('/api/auth/register-customer', {
      ...credentials,
      clientType: 'Web',
    })
    if (!data.success) throw new Error(data.message || 'Customer registration failed')
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

  forgotPassword: async (command: ForgotPasswordCommand): Promise<ResponseData<ForgotPasswordResult>> => {
    const { data } = await apiClient.post<ApiResponse<ForgotPasswordResult>>('/api/auth/forgot-password', command)
    if (!data.success) {
      throw new Error(data.message || 'Failed to send password reset email')
    }
    return data.data
  },

  resetPassword: async (command: ResetPasswordCommand): Promise<ResponseData<ResetPasswordResult>> => {
    const { data } = await apiClient.post<ApiResponse<ResetPasswordResult>>('/api/auth/reset-password', command)
    if (!data.success) {
      throw new Error(data.message || 'Failed to reset password')
    }
    return data.data
  },
}
