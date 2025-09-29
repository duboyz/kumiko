'use client'

import { LoadingSpinner, MenuList } from '@/components'
import { useRestaurantMenus, useCreateRestaurantMenu } from '@shared'
import { useLocationSelection } from '@shared'
import Link from 'next/link'
import { ContentContainer } from '@/components/ContentContainer'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'

export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menusData, isLoading: menusLoading, error } = useRestaurantMenus(restaurantId || '')
  const createMenuMutation = useCreateRestaurantMenu()
  const router = useRouter()

  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  const createMenu = async (menuData: { name: string; description: string; restaurantId: string }) => {
    try {
      await createMenuMutation.mutateAsync(menuData)
    } catch (error) {
      console.error('Failed to create menu:', error)
    }
  }

  const deleteMenu = async (menuId: string) => {
    console.log('Delete menu:', menuId)
  }


  return (
    <ContentContainer>
      <Link href="/menus/create-menu">Create Menu</Link>
      <RestaurantMenus router={router} />
      {/* <MenuList
        menus={menusData?.menus || []}
        restaurantId={restaurantId || ''}
        restaurantName={selectedLocation?.name || 'Restaurant'}
        isLoading={menusLoading}
        onCreateMenu={createMenu}
        onDeleteMenu={deleteMenu}
        createMenuLoading={createMenuMutation.isPending}
      /> */}
    </ContentContainer>
  )
}
