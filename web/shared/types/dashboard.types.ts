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

export interface WeeklyOrderStats {
    weekStartDate: string
    weekNumber: number
    year: number
    orderCount: number
    itemCount: number
}

export interface WeeklyRevenueStats {
    weekStartDate: string
    weekNumber: number
    year: number
    revenue: number
}

export interface MonthlyOrderStats {
    monthStartDate: string
    month: number
    year: number
    orderCount: number
    itemCount: number
}

export interface MonthlyRevenueStats {
    monthStartDate: string
    month: number
    year: number
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
    weeklyOrders: WeeklyOrderStats[]
    weeklyRevenue: WeeklyRevenueStats[]
    monthlyOrders: MonthlyOrderStats[]
    monthlyRevenue: MonthlyRevenueStats[]
    overall: OverallStats
}

