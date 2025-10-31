'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import type { DailyOrderStats, WeeklyOrderStats, MonthlyOrderStats } from '@shared'

type OrderData = DailyOrderStats | WeeklyOrderStats | MonthlyOrderStats

interface OrdersChartProps {
    data: OrderData[]
    period: 'daily' | 'weekly' | 'monthly'
}

export function OrdersChart({ data, period }: OrdersChartProps) {
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Orders
                    </CardTitle>
                    <CardDescription>{getPeriodLabel(period)} order count</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
                </CardContent>
            </Card>
        )
    }

    const maxOrders = Math.max(...data.map(d => d.orderCount))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Orders
                </CardTitle>
                <CardDescription>{getPeriodLabel(period)} orders over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={getItemKey(item, index)} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {formatLabel(item, period)}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-muted-foreground">{item.itemCount} items</span>
                                    <span className="font-medium">{item.orderCount} orders</span>
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${maxOrders > 0 ? (item.orderCount / maxOrders) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function getPeriodLabel(period: 'daily' | 'weekly' | 'monthly'): string {
    switch (period) {
        case 'daily': return 'Daily'
        case 'weekly': return 'Weekly'
        case 'monthly': return 'Monthly'
    }
}

function getItemKey(item: OrderData, index: number): string {
    if ('date' in item) return item.date
    if ('weekStartDate' in item) return `${item.weekStartDate}-${item.weekNumber}`
    if ('monthStartDate' in item) return `${item.monthStartDate}-${item.month}`
    return index.toString()
}

function formatLabel(item: OrderData, period: 'daily' | 'weekly' | 'monthly'): string {
    if (period === 'daily' && 'date' in item) {
        return new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }
    
    if (period === 'weekly' && 'weekStartDate' in item) {
        return `Week ${item.weekNumber}, ${item.year}`
    }
    
    if (period === 'monthly' && 'monthStartDate' in item) {
        return new Date(item.monthStartDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        })
    }
    
    return 'Unknown'
}

