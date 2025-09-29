'use client'

import { LoadingSpinner } from '@/components'
import { useRestaurantMenus, useCreateRestaurantMenu, ResponseData } from '@shared'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/components/ContentContainer'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'
import { Button } from '@/stories/atoms/Button/Button'
import { CreateRestaurantMenuData } from '@shared'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SimpleImportWizard } from './import/components/SimpleImportWizard'
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

  const handleGenerateMenu = async (file: File, restaurantId: string) => {
    console.log('Generating menu from image...', file.name, 'for restaurant:', restaurantId)
  }


  return (
    <ContentContainer>

      <Button variant="default" onClick={createMenu}>Create Menu</Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Create Menu from image</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Menu from image</DialogTitle>
          </DialogHeader>
          <SimpleImportWizard onGenerateMenu={handleGenerateMenu} />
        </DialogContent>


      </Dialog>

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
