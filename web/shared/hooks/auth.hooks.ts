import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import { LoginRdto, RegisterRdto, AuthSdto, UserSdto, RefreshTokenResult } from '../types'
import { useRouter } from 'next/navigation'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: Omit<LoginRdto, 'clientType'>) => authApi.login(credentials),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      router.push('/dashboard')
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: Omit<RegisterRdto, 'clientType'>) => authApi.register(credentials),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      router.push('/dashboard')
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear()
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

  return useMutation({
    mutationFn: () => authApi.refresh(),
    onSuccess: data => {
      // Token refresh successful, invalidate current user query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
    onError: () => {
      // Token refresh failed, clear all queries and redirect to login
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}
