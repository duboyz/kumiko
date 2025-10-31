'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import type { DailyOrderStats, WeeklyOrderStats, MonthlyOrderStats } from '@shared'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type OrderData = DailyOrderStats | WeeklyOrderStats | MonthlyOrderStats

interface OrdersLineChartProps {
    data: OrderData[]
    period: 'daily' | 'weekly' | 'monthly'
}

export function OrdersLineChart({ data, period }: OrdersLineChartProps) {
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

    // Transform data for recharts
    const chartData = data.map((item, index) => ({
        name: formatLabel(item, period),
        orders: item.orderCount,
        items: item.itemCount,
        index,
    }))

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
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {payload[0].payload.name}
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {payload[0].value} orders
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {payload[0].payload.items} items
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth={2}
                            dot={{ fill: 'rgb(59, 130, 246)', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
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

function formatLabel(item: OrderData, period: 'daily' | 'weekly' | 'monthly'): string {
    if (period === 'daily' && 'date' in item) {
        return new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    if (period === 'weekly' && 'weekStartDate' in item) {
        return `W${item.weekNumber}`
    }

    if (period === 'monthly' && 'monthStartDate' in item) {
        return new Date(item.monthStartDate).toLocaleDateString('en-US', {
            month: 'short'
        })
    }

    return 'Unknown'
}

