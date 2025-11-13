import { ApiResponse } from "@shared"
import apiClient from "./client"

export const userApi = {
    deleteMe: async (userId: string, email: string, password: string): Promise<void> => {
        const { data } = await apiClient.delete<ApiResponse<null>>('/api/users/delete-me', {
            data: {
                userId,
                email,
                password,
            },
        })
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete user')
        }
    },
}