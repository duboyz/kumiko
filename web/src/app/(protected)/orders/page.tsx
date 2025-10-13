'use client'

import { useState } from 'react'
import { ContentContainer, PageHeader } from '@/components'
import { LoadingSpinner } from '@/components'
import { useLocationSelection, useRestaurantOrders } from '@shared'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'
import { OrdersTableView, OrdersKanbanView } from '@/stories/orders'
import { Button } from '@/components/ui/button'
import { Table, LayoutGrid } from 'lucide-react'

type ViewMode = 'table' | 'kanban'

export default function OrdersPage() {
  const { selectedLocation, isLoading: locationLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')

  const { data: orders, isLoading: ordersLoading } = useRestaurantOrders(restaurantId || '')

  if (locationLoading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  const allActiveOrders = orders?.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled') || []

  return (
    <ContentContainer>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Orders"
          description="Manage and track your restaurant orders"
        />

        {/* View Mode Toggle */}
        <div className="flex gap-2 border rounded-lg p-1">
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <OrdersTableView orders={allActiveOrders} />
      ) : (
        <OrdersKanbanView orders={allActiveOrders} />
      )}
    </ContentContainer>
  )
}

