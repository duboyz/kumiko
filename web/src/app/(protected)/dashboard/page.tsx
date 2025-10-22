'use client'

import { useState } from 'react'
import { ContentContainer, LoadingState, ErrorState, NoLocation } from '@/components'
import { useTranslations } from 'next-intl'
import { useLocationSelection, useDashboardStats } from '@shared'
import { StatCard, TopMenuItems, RevenueChart, OrdersChart } from '@/stories/dashboard'
import { DollarSign, ShoppingBag, TrendingUp, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

const KumikoDashboardImage = '/icons/kumiko-dashboard.png'

type TimeRange = 7 | 14 | 30

export default function DashboardPage() {
  const t = useTranslations()
  const { selectedLocation } = useLocationSelection()
  const [timeRange, setTimeRange] = useState<TimeRange>(30)

  const {
    data: stats,
    isLoading,
    error,
  } = useDashboardStats({
    restaurantId: selectedLocation?.id || '',
    days: timeRange,
  })

  if (!selectedLocation) {
    return (
      <ContentContainer>
        <NoLocation />
      </ContentContainer>
    )
  }

  if (selectedLocation.type !== 'Restaurant') {
    return (
      <ContentContainer>
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">Dashboard is currently only available for restaurants.</p>
        </div>
      </ContentContainer>
    )
  }

  if (isLoading) return <LoadingState variant="page" />
  if (error) return <ErrorState message={error instanceof Error ? error.message : 'Failed to load dashboard stats'} />
  if (!stats) return <ErrorState message="No data available" />

  return (
    <ContentContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <img src={KumikoDashboardImage} alt="Kumiko Dashboard" width={80} height={80} className="rounded-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your restaurant.</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            <Button variant={timeRange === 7 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(7)}>
              7 days
            </Button>
            <Button variant={timeRange === 14 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(14)}>
              14 days
            </Button>
            <Button variant={timeRange === 30 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(30)}>
              30 days
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={stats.overall.totalRevenue}
            icon={DollarSign}
            isCurrency
            currency={selectedLocation.currency}
          />
          <StatCard
            title="Total Orders"
            value={stats.overall.totalOrders}
            icon={ShoppingBag}
            description={`${stats.overall.totalItemsSold} items sold`}
          />
          <StatCard
            title="Average Order Value"
            value={stats.overall.averageOrderValue}
            icon={TrendingUp}
            isCurrency
            currency={selectedLocation.currency}
          />
          <StatCard title="Items Sold" value={stats.overall.totalItemsSold} icon={Package} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={stats.dailyRevenue} currency={selectedLocation.currency} />
          <OrdersChart data={stats.dailyOrders} />
        </div>

        {/* Top Selling Items */}
        <TopMenuItems items={stats.topMenuItems} currency={selectedLocation.currency} />
      </div>
    </ContentContainer>
  )
}
