'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { formatPrice, formatCurrencyShort } from '@shared'
import type { DailyRevenueStats, WeeklyRevenueStats, MonthlyRevenueStats, Currency } from '@shared'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslations, useLocale } from 'next-intl'

type RevenueData = DailyRevenueStats | WeeklyRevenueStats | MonthlyRevenueStats

interface RevenueLineChartProps {
    data: RevenueData[]
    currency: Currency
    period: 'daily' | 'weekly' | 'monthly'
}

export function RevenueLineChart({ data, currency, period }: RevenueLineChartProps) {
    const t = useTranslations('dashboard')
    const locale = useLocale()
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        {t('revenue')}
                    </CardTitle>
                    <CardDescription>{t('revenueBreakdown', { period: t(period) })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">{t('noRevenueDataYet')}</p>
                </CardContent>
            </Card>
        )
    }

    // Transform data for recharts
    const chartData = data.map((item, index) => ({
        name: formatLabel(item, period, locale),
        revenue: item.revenue,
        index,
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {t('revenue')}
                </CardTitle>
                <CardDescription>{t('revenueOverPeriod', { period: t(period) })}</CardDescription>
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
                            tickFormatter={(value) => formatCurrencyShort(value, currency)}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {payload[0].payload.name}
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {formatPrice(payload[0].value as number, currency)}
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
                            dataKey="revenue"
                            stroke="rgb(34, 197, 94)"
                            strokeWidth={2}
                            dot={{ fill: 'rgb(34, 197, 94)', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

function formatLabel(item: RevenueData, period: 'daily' | 'weekly' | 'monthly', locale: string = 'en-US'): string {
    if (period === 'daily' && 'date' in item) {
        return new Date(item.date).toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric'
        })
    }

    if (period === 'weekly' && 'weekStartDate' in item) {
        return `W${item.weekNumber}`
    }

    if (period === 'monthly' && 'monthStartDate' in item) {
        return new Date(item.monthStartDate).toLocaleDateString(locale, {
            month: 'short'
        })
    }

    return ''
}

