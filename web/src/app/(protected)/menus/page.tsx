'use client'

import { LoadingSpinner } from '@/components'
import { useCreateRestaurantMenu, ResponseData } from '@shared'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/components/ContentContainer'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'
import { Button } from '@/stories/atoms/Button/Button'
import { CreateRestaurantMenuData } from '@shared'
import { useTranslations } from 'next-intl'

export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { mutate: createMenuMutation } = useCreateRestaurantMenu()
  const router = useRouter()

  const t = useTranslations()
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
      <div className="flex items-center gap-2">
        <Button variant="default" onClick={createMenu} fit={true}>{t('menus.createMenu')}</Button>
        <Button variant="secondary" onClick={() => router.push('/menus/import')} fit={true}>{t('menus.importMenu')}</Button>

      </div>
      <RestaurantMenus router={router} />
    </ContentContainer >
  )
}
