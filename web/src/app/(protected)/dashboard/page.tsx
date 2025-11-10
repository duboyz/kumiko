'use client'

import { useState } from 'react'
import { ContentContainer, LoadingState, ErrorState, NoLocation } from '@/components'
import { useTranslations } from 'next-intl'
import { useLocationSelection, useDashboardStats } from '@shared'
import { StatCard, TopMenuItems, RevenueChart, OrdersChart, RevenueLineChart, OrdersLineChart } from '@/stories/dashboard'
import { DollarSign, ShoppingBag, TrendingUp, Package, BarChart3, LineChart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const KumikoDashboardImage = '/icons/kumiko-dashboard.png'

type TimeRange = 7 | 14 | 30
type Period = 'daily' | 'weekly' | 'monthly'
type ChartType = 'bar' | 'line'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const { selectedLocation } = useLocationSelection()
  const [timeRange, setTimeRange] = useState<TimeRange>(30)
  const [period, setPeriod] = useState<Period>('daily')
  const [chartType, setChartType] = useState<ChartType>('bar')

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
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('dashboardOnlyForRestaurants')}</p>
        </div>
      </ContentContainer>
    )
  }

  if (isLoading) return <LoadingState variant="page" />
  if (error) return <ErrorState message={error instanceof Error ? error.message : t('failedToLoad')} />
  if (!stats) return <ErrorState message={t('noDataAvailable')} />

  return (
    <ContentContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <img src={KumikoDashboardImage} alt="Kumiko Dashboard" width={80} height={80} className="rounded-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
              <p className="text-muted-foreground">{t('welcomeBack')}</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            <Button variant={timeRange === 7 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(7)}>
              {t('days7')}
            </Button>
            <Button variant={timeRange === 14 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(14)}>
              {t('days14')}
            </Button>
            <Button variant={timeRange === 30 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(30)}>
              {t('days30')}
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('totalRevenue')}
            value={stats.overall.totalRevenue}
            icon={DollarSign}
            isCurrency
            currency={selectedLocation.currency}
          />
          <StatCard
            title={t('totalOrders')}
            value={stats.overall.totalOrders}
            icon={ShoppingBag}
            description={t('itemsSoldDescription', { count: stats.overall.totalItemsSold })}
          />
          <StatCard
            title={t('averageOrderValue')}
            value={stats.overall.averageOrderValue}
            icon={TrendingUp}
            isCurrency
            currency={selectedLocation.currency}
          />
          <StatCard title={t('itemsSold')} value={stats.overall.totalItemsSold} icon={Package} />
        </div>

        {/* Charts */}
        <div className="space-y-4">
          {/* Period and Chart Type Selectors */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('analytics')}</h2>
            <div className="flex gap-4">
              {/* Chart Type Toggle */}
              <div className="flex gap-2 border rounded-lg p-1">
                <Button
                  variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('bar')}
                </Button>
                <Button
                  variant={chartType === 'line' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  {t('line')}
                </Button>
              </div>

              {/* Period Selector */}
              <div className="flex gap-2">
                <Button
                  variant={period === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod('daily')}
                >
                  {t('daily')}
                </Button>
                <Button
                  variant={period === 'weekly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod('weekly')}
                >
                  {t('weekly')}
                </Button>
                <Button
                  variant={period === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod('monthly')}
                >
                  {t('monthly')}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartType === 'bar' ? (
              <>
                <RevenueChart
                  data={period === 'daily' ? stats.dailyRevenue : period === 'weekly' ? stats.weeklyRevenue : stats.monthlyRevenue}
                  currency={selectedLocation.currency}
                  period={period}
                />
                <OrdersChart
                  data={period === 'daily' ? stats.dailyOrders : period === 'weekly' ? stats.weeklyOrders : stats.monthlyOrders}
                  period={period}
                />
              </>
            ) : (
              <>
                <RevenueLineChart
                  data={period === 'daily' ? stats.dailyRevenue : period === 'weekly' ? stats.weeklyRevenue : stats.monthlyRevenue}
                  currency={selectedLocation.currency}
                  period={period}
                />
                <OrdersLineChart
                  data={period === 'daily' ? stats.dailyOrders : period === 'weekly' ? stats.weeklyOrders : stats.monthlyOrders}
                  period={period}
                />
              </>
            )}
          </div>
        </div>

        {/* Top Selling Items */}
        <TopMenuItems items={stats.topMenuItems} currency={selectedLocation.currency} />
      </div>
    </ContentContainer>
  )
}
