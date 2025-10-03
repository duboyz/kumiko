'use client'

import { LoadingSpinner } from '@/components'
import { useLocationSelection } from '@shared'
import { ContentContainer, PageHeader } from '@/components'
import { OrderList } from '@/stories/orders'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'

export default function OrdersPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()

  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  return (
    <ContentContainer>
      <PageHeader
        title="Orders"
        description="Manage customer orders and track pickup times"
      />
      <OrderList />
    </ContentContainer>
  )
}
