'use client'

import { ContentContainer, PageHeader } from '@/components'
import { LoadingSpinner } from '@/components'
import { useLocationSelection, useRestaurantOrders } from '@shared'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'
import { OrdersList } from '@/stories/orders/OrdersList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OrdersPage() {
  const { selectedLocation, isLoading: locationLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

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
      <PageHeader
        title="Orders"
        description="Manage and track your restaurant orders"
      />

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
          <OrdersList orders={allActiveOrders} isLoading={ordersLoading} />
        </TabsContent>

        <TabsContent value="pending">
          <OrdersList orders={pendingOrders} isLoading={ordersLoading} />
        </TabsContent>

        <TabsContent value="confirmed">
          <OrdersList orders={confirmedOrders} isLoading={ordersLoading} />
        </TabsContent>

        <TabsContent value="ready">
          <OrdersList orders={readyOrders} isLoading={ordersLoading} />
        </TabsContent>

        <TabsContent value="completed">
          <OrdersList orders={completedOrders} isLoading={ordersLoading} />
        </TabsContent>

        <TabsContent value="all">
          <OrdersList orders={orders || []} isLoading={ordersLoading} />
        </TabsContent>
      </Tabs>
    </ContentContainer>
  )
}

