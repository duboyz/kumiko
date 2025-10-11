'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import type { DailyOrderStats } from '@shared'

interface OrdersChartProps {
    data: DailyOrderStats[]
}

export function OrdersChart({ data }: OrdersChartProps) {
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Orders
                    </CardTitle>
                    <CardDescription>Daily order count</CardDescription>
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
                <CardDescription>Daily orders over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map(day => (
                        <div key={day.date} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-muted-foreground">{day.itemCount} items</span>
                                    <span className="font-medium">{day.orderCount} orders</span>
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${maxOrders > 0 ? (day.orderCount / maxOrders) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

