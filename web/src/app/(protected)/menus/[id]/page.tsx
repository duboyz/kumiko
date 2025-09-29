'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRestaurantMenus, useLocationSelection } from '@shared'
import { LoadingSpinner } from '@/components'
import { ContentLoadingError } from '@/stories/Components/ContentLoadingError/ContentLoadingError'
import { ContentNotFound } from '@/stories/Components/ContentNotFound/ContentNotFound'
import { ContentContainer } from '@/components/ContentContainer'
import { RestaurantMenu } from '@/stories/RestaurantMenu/Upsert/RestaurantMenu'

export default function MenuEditPage() {
  const params = useParams()
  const { selectedLocation } = useLocationSelection()

  const menuId = params.id as string
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menusData, isLoading, error } = useRestaurantMenus(restaurantId || '')

  const menu = menusData?.menus?.find(m => m.id === menuId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ContentLoadingError message={error.message} title="Error Loading Menu" backToText="Back to Menus" backToLink="/menus" />
  if (!menu) return <ContentNotFound message="The menu you're looking for doesn't exist or you don't have access to it." title="Menu Not Found" backToText="Back to Menus" backToLink="/menus" />


  return (
    <ContentContainer>
      {/* <MenuEditor menu={menu} onBackToList={() => router.push('/menus')} /> */}

      <RestaurantMenu menu={menu} />

    </ContentContainer>
  )
}
