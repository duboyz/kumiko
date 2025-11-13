'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { formatPrice } from '@shared'
import { Currency } from '@shared'
import { useTranslations } from 'next-intl'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    isCurrency?: boolean
    currency?: Currency
    trend?: {
        value: number
        isPositive: boolean
    }
}

export function StatCard({ title, value, icon: Icon, description, isCurrency, currency, trend }: StatCardProps) {
    const t = useTranslations('dashboard')
    const displayValue = isCurrency && typeof value === 'number'
        ? formatPrice(value, currency || Currency.USD)
        : value

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                {trend && (
                    <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? '↑' : '↓'} {t('fromPreviousPeriod', { value: Math.abs(trend.value) })}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

