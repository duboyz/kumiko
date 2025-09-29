'use client'

import { LoadingSpinner, MenuList } from '@/components'
import { useRestaurantMenus, useCreateRestaurantMenu, ResponseData } from '@shared'
import { useLocationSelection } from '@shared'
import Link from 'next/link'
import { ContentContainer } from '@/components/ContentContainer'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'
import { Button } from '@/stories/atoms/Button/Button'
import { CreateRestaurantMenuData } from '@shared'
export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menusData, isLoading: menusLoading, error } = useRestaurantMenus(restaurantId || '')
  const { mutate: createMenuMutation } = useCreateRestaurantMenu()
  const router = useRouter()

  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  const createMenu = async () => {
    const menuData = {
      name: 'New Menu',
      description: 'New Menu Description',
      restaurantId: restaurantId || ''
    }
    try {
      createMenuMutation(menuData, {
        onSuccess: (menu: ResponseData<CreateRestaurantMenuData>) => {
          if (!menu) return
          router.push(`/menus/${menu.id}`)
        }
      })
    } catch (error) {
      console.error('Failed to create menu:', error)
    }
  }


  return (
    <ContentContainer>

      <Button variant="default" onClick={createMenu}>Create Menu</Button>

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
