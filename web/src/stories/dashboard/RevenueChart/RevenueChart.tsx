'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { formatPrice } from '@shared'
import type { DailyRevenueStats, WeeklyRevenueStats, MonthlyRevenueStats, Currency } from '@shared'
import { useTranslations, useLocale } from 'next-intl'

type RevenueData = DailyRevenueStats | WeeklyRevenueStats | MonthlyRevenueStats

interface RevenueChartProps {
    data: RevenueData[]
    currency: Currency
    period: 'daily' | 'weekly' | 'monthly'
}

export function RevenueChart({ data, currency, period }: RevenueChartProps) {
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

    const maxRevenue = Math.max(...data.map(d => d.revenue))

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
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={getItemKey(item, index)} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {formatLabel(item, period, locale)}
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

function getItemKey(item: RevenueData, index: number): string {
    if ('date' in item) return item.date
    if ('weekStartDate' in item) return `${item.weekStartDate}-${item.weekNumber}`
    if ('monthStartDate' in item) return `${item.monthStartDate}-${item.month}`
    return index.toString()
}

function formatLabel(item: RevenueData, period: 'daily' | 'weekly' | 'monthly', locale: string = 'en-US'): string {
    if (period === 'daily' && 'date' in item) {
        return new Date(item.date).toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric'
        })
    }

    if (period === 'weekly' && 'weekStartDate' in item) {
        // This will be translated using the translation keys
        return `W${item.weekNumber}, ${item.year}`
    }

    if (period === 'monthly' && 'monthStartDate' in item) {
        return new Date(item.monthStartDate).toLocaleDateString(locale, {
            month: 'short',
            year: 'numeric'
        })
    }

    return ''
}

