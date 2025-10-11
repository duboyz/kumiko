export interface GetDashboardStatsQuery {
    restaurantId: string
    days?: number
}

export interface TopMenuItem {
    menuItemId: string
    menuItemName: string
    totalQuantitySold: number
    totalRevenue: number
}

export interface DailyOrderStats {
    date: string
    orderCount: number
    itemCount: number
}

export interface DailyRevenueStats {
    date: string
    revenue: number
}

export interface OverallStats {
    totalOrders: number
    totalItemsSold: number
    totalRevenue: number
    averageOrderValue: number
}

export interface DashboardStatsResult {
    topMenuItems: TopMenuItem[]
    dailyOrders: DailyOrderStats[]
    dailyRevenue: DailyRevenueStats[]
    overall: OverallStats
}

