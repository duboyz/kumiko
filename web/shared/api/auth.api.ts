import { LoginRdto, RegisterRdto, AuthSdto, UserSdto, ResponseData, ApiResponse, RefreshTokenResult } from '@shared'
import apiClient from './client'

export const authApi = {
  login: async (credentials: Omit<LoginRdto, 'clientType'>): Promise<ResponseData<AuthSdto>> => {
    console.log('🔐 Login API call starting...', { credentials: { ...credentials, password: '[REDACTED]' } })

    const response = await apiClient.post<ApiResponse<AuthSdto>>('/api/auth/login', {
      ...credentials,
      clientType: 'Web',
    })

    console.log('🔐 Login API response:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
    })

    // Check if cookies were set in the response
    const setCookieHeader = response.headers['set-cookie']
    console.log('🍪 Set-Cookie headers received:', setCookieHeader)

    // Check all response headers
    console.log('🍪 All response headers:', response.headers)

    // Check current cookies in browser
    if (typeof document !== 'undefined') {
      const currentCookies = document.cookie
      console.log('🍪 Current cookies in browser:', currentCookies)

      // Check if cookies are accessible after a short delay
      setTimeout(() => {
        const delayedCookies = document.cookie
        console.log('🍪 Cookies after delay:', delayedCookies)
      }, 100)
    }

    if (!response.data.success) throw new Error(response.data.message || 'Login failed')
    return response.data.data
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
