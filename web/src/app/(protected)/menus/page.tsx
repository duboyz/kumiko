'use client'

import { LoadingSpinner } from '@/components'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/components/ContentContainer'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/components/RestaurantRequired/RestaurantRequired'

export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()

  const router = useRouter()

  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  return (
    <ContentContainer>
      <RestaurantMenus router={router} />
    </ContentContainer>
  )
}
