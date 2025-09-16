import type { User } from './user.types'

export type ClientType = 'Web' | 'Mobile'

export interface LoginRdto {
  email: string
  password: string
  clientType: ClientType
}

export interface RegisterRdto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  clientType: ClientType
}

export interface AuthSdto {
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
}

export interface RefreshTokenRequest {
  refreshToken?: string
  clientType?: ClientType
}

export interface RefreshTokenResult {
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  expiresAt: Date | null
}
