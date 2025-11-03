import { apiClient } from './api.service'
import { storageService } from './storage.service'
import { LoginCommand, LoginResult, ApiResponse } from '@/types/auth.types'

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    const command: LoginCommand = {
      email,
      password,
      clientType: 'Mobile',
    }

    const { data } = await apiClient.post<ApiResponse<LoginResult>>(
      '/api/auth/login',
      command
    )

    if (!data.success) {
      throw new Error(data.message || 'Login failed')
    }

    const { accessToken, refreshToken, expiresAt } = data.data

    if (accessToken && refreshToken && expiresAt) {
      await storageService.saveTokens(accessToken, refreshToken, expiresAt)
    }

    return data.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout')
    } finally {
      await storageService.clearTokens()
      await storageService.clearSelectedLocation()
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await storageService.getAccessToken()
    const expiresAt = await storageService.getExpiresAt()

    if (!token || !expiresAt) {
      return false
    }

    const expirationDate = new Date(expiresAt)
    return expirationDate > new Date()
  },
}
