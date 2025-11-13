import { userApi } from "@shared/api/user.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteMe = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, email, password }: { userId: string; email: string; password: string }) => userApi.deleteMe(userId, email, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error) => {
            console.error('Failed to delete me:', error)
        },
    })
}