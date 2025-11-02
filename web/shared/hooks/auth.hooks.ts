import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import { LoginRdto, RegisterRdto, AuthSdto, UserSdto, RefreshTokenResult } from '../types'
import type { ForgotPasswordCommand, ResetPasswordCommand } from '../types/auth.types'
import { useRouter } from 'next/navigation'
import { useLocationStore } from '../stores/location-store'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: Omit<LoginRdto, 'clientType'>) => authApi.login(credentials),
    onSuccess: async data => {
      // First, invalidate and wait for user data
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })

      // Check if user has any locations, redirect to onboarding if not
      // The check will happen in the protected layout
      router.push('/dashboard')
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: Omit<RegisterRdto, 'clientType'>) => authApi.register(credentials),
    onSuccess: async data => {
      // New users always need onboarding
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      router.push('/onboarding')
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { clearSelectedLocation } = useLocationStore()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear()

      // Clear all Zustand stores
      clearSelectedLocation()

      // Clear persisted storage manually
      if (typeof window !== 'undefined') {
        localStorage.removeItem('location-storage')
        sessionStorage.clear()
      }

      // Redirect to login
      router.push('/login')
    },
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRefreshToken = () => {
  const queryClient = useQueryClient()
  const { clearSelectedLocation } = useLocationStore()

  return useMutation({
    mutationFn: () => authApi.refresh(),
    onSuccess: data => {
      // Token refresh successful, invalidate current user query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
    onError: () => {
      // Token refresh failed, clear everything
      queryClient.clear()
      clearSelectedLocation()

      // Clear persisted storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('location-storage')
        sessionStorage.clear()
      }

      window.location.href = '/login'
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (command: ForgotPasswordCommand) => authApi.forgotPassword(command),
  })
}

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (command: ResetPasswordCommand) => authApi.resetPassword(command),
    onSuccess: () => {
      // Redirect to login after successful password reset
      router.push('/login?reset=success')
    },
  })
}
