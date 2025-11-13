import { userApi } from "@shared/api/user.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocationStore } from "@shared/stores/location-store"

export const useDeleteMe = () => {
    const queryClient = useQueryClient()
    const { clearSelectedLocation } = useLocationStore()

    return useMutation({
        mutationFn: ({ userId, email, password }: { userId: string; email: string; password: string }) => userApi.deleteMe(userId, email, password),
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
        },
        onError: (error) => {
            console.error('Failed to delete me:', error)
        },
    })
}