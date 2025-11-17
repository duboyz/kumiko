import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import type { LoginRdto, RegisterCustomerCommand } from '../types/auth.types'
import { useCustomerAuthStore } from '../stores/customer-auth-store'

export const useCustomerLogin = () => {
    const queryClient = useQueryClient()
    const { setCustomer } = useCustomerAuthStore()

    return useMutation({
        mutationFn: (credentials: Omit<LoginRdto, 'clientType'>) => authApi.login(credentials),
        onSuccess: async () => {
            // Fetch customer data after login
            const userData = await authApi.getCurrentUser()
            if (userData) {
                setCustomer(userData)
                queryClient.invalidateQueries({ queryKey: ['customerProfile'] })
            }
        },
    })
}

export const useCustomerRegister = () => {
    const queryClient = useQueryClient()
    const { setCustomer } = useCustomerAuthStore()

    return useMutation({
        mutationFn: (credentials: Omit<RegisterCustomerCommand, 'clientType'>) => authApi.registerCustomer(credentials),
        onSuccess: async () => {
            // Fetch customer data after registration
            const userData = await authApi.getCurrentUser()
            if (userData) {
                setCustomer(userData)
                queryClient.invalidateQueries({ queryKey: ['customerProfile'] })
            }
        },
    })
}

export const useCustomerLogout = () => {
    const queryClient = useQueryClient()
    const { clearCustomer } = useCustomerAuthStore()

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            // Clear customer auth state
            clearCustomer()
            queryClient.removeQueries({ queryKey: ['customerProfile'] })
        },
    })
}

export const useCustomerProfile = () => {
    const { isAuthenticated } = useCustomerAuthStore()

    return useQuery({
        queryKey: ['customerProfile'],
        queryFn: () => authApi.getCurrentUser(),
        enabled: isAuthenticated,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

