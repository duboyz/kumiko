'use client'

import { useState } from 'react'
import { ContentContainer, PageHeader } from '@/components'
import { LoadingSpinner } from '@/components'
import { useLocationSelection, useRestaurantOrders } from '@shared'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'
import { OrdersList, OrdersTableView, OrdersKanbanView } from '@/stories/orders'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Table, LayoutGrid } from 'lucide-react'

type ViewMode = 'list' | 'table' | 'kanban'

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

  const pendingOrders = orders?.filter(o => o.status === 'Pending') || []
  const confirmedOrders = orders?.filter(o => o.status === 'Confirmed') || []
  const readyOrders = orders?.filter(o => o.status === 'Ready') || []
  const completedOrders = orders?.filter(o => o.status === 'Completed') || []
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

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="active" className="relative">
            Active
            {allActiveOrders.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {allActiveOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingOrders.length > 0 && (
              <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
                {pendingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {viewMode === 'table' ? (
            <OrdersTableView orders={allActiveOrders} />
          ) : viewMode === 'kanban' ? (
            <OrdersKanbanView orders={allActiveOrders} />
          ) : (
            <OrdersList orders={allActiveOrders} isLoading={ordersLoading} />
          )}
        </TabsContent>

        <TabsContent value="pending">
          {viewMode === 'table' ? (
            <OrdersTableView orders={pendingOrders} />
          ) : viewMode === 'kanban' ? (
            <OrdersKanbanView orders={pendingOrders} />
          ) : (
            <OrdersList orders={pendingOrders} isLoading={ordersLoading} />
          )}
        </TabsContent>

        <TabsContent value="confirmed">
          {viewMode === 'table' ? (
            <OrdersTableView orders={confirmedOrders} />
          ) : viewMode === 'kanban' ? (
            <OrdersKanbanView orders={confirmedOrders} />
          ) : (
            <OrdersList orders={confirmedOrders} isLoading={ordersLoading} />
          )}
        </TabsContent>

        <TabsContent value="ready">
          {viewMode === 'table' ? (
            <OrdersTableView orders={readyOrders} />
          ) : viewMode === 'kanban' ? (
            <OrdersKanbanView orders={readyOrders} />
          ) : (
            <OrdersList orders={readyOrders} isLoading={ordersLoading} />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {viewMode === 'table' ? (
            <OrdersTableView orders={completedOrders} />
          ) : viewMode === 'kanban' ? (
            <OrdersKanbanView orders={completedOrders} />
          ) : (
            <OrdersList orders={completedOrders} isLoading={ordersLoading} />
          )}
        </TabsContent>

        <TabsContent value="all">
          {viewMode === 'table' ? (
            <OrdersTableView orders={orders || []} />
          ) : viewMode === 'kanban' ? (
            <OrdersKanbanView orders={orders || []} />
          ) : (
            <OrdersList orders={orders || []} isLoading={ordersLoading} />
          )}
        </TabsContent>
      </Tabs>
    </ContentContainer>
  )
}

