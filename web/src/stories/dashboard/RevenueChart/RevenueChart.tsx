'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { formatPrice } from '@shared'
import type { DailyRevenueStats, Currency } from '@shared'

interface RevenueChartProps {
    data: DailyRevenueStats[]
    currency: Currency
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Revenue
                    </CardTitle>
                    <CardDescription>Daily revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet</p>
                </CardContent>
            </Card>
        )
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Revenue
                </CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
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
                                <span className="font-medium">{formatPrice(day.revenue, currency)}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

