'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import { formatPrice } from '@shared'
import type { TopMenuItem, Currency } from '@shared'
import { useTranslations } from 'next-intl'

interface TopMenuItemsProps {
    items: TopMenuItem[]
    currency: Currency
}

export function TopMenuItems({ items, currency }: TopMenuItemsProps) {
    const t = useTranslations('dashboard')

    if (items.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        {t('topSellingItems')}
                    </CardTitle>
                    <CardDescription>{t('topSellingItemsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">{t('noOrdersYet')}</p>
                </CardContent>
            </Card>
        )
    }

    const maxQuantity = Math.max(...items.map(item => item.totalQuantitySold))

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    {t('topSellingItems')}
                </CardTitle>
                <CardDescription>{t('mostPopularItemsPeriod')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={item.menuItemId} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-muted-foreground w-6">#{index + 1}</span>
                                    <div>
                                        <p className="text-sm font-medium">{item.menuItemName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t('soldWithRevenue', {
                                                count: item.totalQuantitySold,
                                                revenue: formatPrice(item.totalRevenue, currency)
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold">{item.totalQuantitySold}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${(item.totalQuantitySold / maxQuantity) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

