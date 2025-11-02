import { UserSdto } from './user.types'

// Forgot Password
export interface ForgotPasswordCommand {
  email: string
}

export interface ForgotPasswordResult {
  message: string
}

// Reset Password
export interface ResetPasswordCommand {
  token: string
  newPassword: string
}

export interface ResetPasswordResult {
  message: string
}

// Login
export interface LoginRdto {
  email: string
  password: string
  clientType?: string
}

export interface AuthSdto {
  accessToken: string
  refreshToken: string
  user: UserSdto
}

// Register
export interface RegisterRdto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  clientType?: string
}

// Refresh Token
export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}
