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
import { useTranslations } from 'next-intl'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { CreateMenuForm } from '@/components'
import { Modal } from '@/stories/molecules/Modal'

export default function MenusPage() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const router = useRouter()

  const t = useTranslations()
  if (isLoading) return <LoadingSpinner />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />


  return (
    <ContentContainer>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => router.push('/menus/import')} fit={true}>{t('menus.importMenu')}</Button>

        <Modal title="Create Menu" description="Create a new menu for your restaurant." isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} triggerText={t('menus.createMenu')}>
          <CreateMenuForm restaurantName={selectedLocation.name} isLoading={false} router={router} restaurantId={restaurantId || ''} />
        </Modal>


      </div>
      <RestaurantMenus router={router} />
    </ContentContainer >
  )
}
