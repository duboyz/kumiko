export interface LoginCommand {
  email: string
  password: string
  clientType?: 'Web' | 'Mobile'
}

export interface LoginResult {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}
