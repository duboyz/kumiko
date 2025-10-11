import type { GetDashboardStatsQuery, DashboardStatsResult, ApiResponse, ResponseData } from '../types'
import apiClient from './client'

export const dashboardApi = {
    getDashboardStats: async (params: GetDashboardStatsQuery): Promise<ResponseData<DashboardStatsResult>> => {
        const { data: response } = await apiClient.get<ApiResponse<DashboardStatsResult>>(
            `/api/restaurants/${params.restaurantId}/dashboard-stats`,
            {
                params: { days: params.days || 30 },
            }
        )
        if (!response.success) throw new Error(response.message || 'Failed to fetch dashboard stats')
        return response.data
    },
}

