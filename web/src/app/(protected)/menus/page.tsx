'use client'

import { LoadingSpinner } from '@/components'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/components/ContentContainer'
import { PageHeader } from '@/components/PageHeader'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/components/RestaurantRequired/RestaurantRequired'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { CreateMenuDialog } from '@/stories/organisms/CreateMenuDialog/CreateMenuDialog'
import { FileUp } from 'lucide-react'

export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()

  const router = useRouter()

  const t = useTranslations("menus")
  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  return (
    <ContentContainer>

      <RestaurantMenus router={router} />
    </ContentContainer>
  )
}
