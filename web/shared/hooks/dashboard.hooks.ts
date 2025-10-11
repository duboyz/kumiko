import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'
import type { GetDashboardStatsQuery } from '../types'

export const useDashboardStats = (params: GetDashboardStatsQuery) => {
    return useQuery({
        queryKey: ['dashboard-stats', params.restaurantId, params.days],
        queryFn: () => dashboardApi.getDashboardStats(params),
        enabled: !!params.restaurantId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

