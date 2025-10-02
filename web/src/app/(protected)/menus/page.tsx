'use client'

import { LoadingSpinner } from '@/components'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/components'
import { RestaurantMenus } from '@/stories/menus/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'

export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()

  const router = useRouter()

  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  return (
    <ContentContainer>
      <RestaurantMenus />
    </ContentContainer>
  )
}
