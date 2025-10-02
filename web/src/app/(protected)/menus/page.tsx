'use client'

import { LoadingSpinner } from '@/stories/shared/LoadingSpinner/LoadingSpinner'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/stories/shared/ContentContainer/ContentContainer'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/shared/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/shared/RestaurantRequired/RestaurantRequired'

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
