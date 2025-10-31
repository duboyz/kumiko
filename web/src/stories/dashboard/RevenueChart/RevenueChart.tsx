'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { formatPrice } from '@shared'
import type { DailyRevenueStats, WeeklyRevenueStats, MonthlyRevenueStats, Currency } from '@shared'

type RevenueData = DailyRevenueStats | WeeklyRevenueStats | MonthlyRevenueStats

interface RevenueChartProps {
    data: RevenueData[]
    currency: Currency
    period: 'daily' | 'weekly' | 'monthly'
}

export function RevenueChart({ data, currency, period }: RevenueChartProps) {
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Revenue
                    </CardTitle>
                    <CardDescription>{getPeriodLabel(period)} revenue breakdown</CardDescription>
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
                <CardDescription>{getPeriodLabel(period)} revenue over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={getItemKey(item, index)} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {formatLabel(item, period)}
                                </span>
                                <span className="font-medium">{formatPrice(item.revenue, currency)}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` }}
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

function getItemKey(item: RevenueData, index: number): string {
    if ('date' in item) return item.date
    if ('weekStartDate' in item) return `${item.weekStartDate}-${item.weekNumber}`
    if ('monthStartDate' in item) return `${item.monthStartDate}-${item.month}`
    return index.toString()
}

function formatLabel(item: RevenueData, period: 'daily' | 'weekly' | 'monthly'): string {
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

