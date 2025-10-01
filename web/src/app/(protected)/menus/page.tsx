'use client'

import { LoadingSpinner } from '@/components'
import { useLocationSelection } from '@shared'
import { ContentContainer } from '@/components/ContentContainer'
import { PageHeader } from '@/components/PageHeader'
import { RestaurantMenus } from '@/stories/pages/RestaurantMenus'
import { useRouter } from 'next/navigation'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'
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
      <PageHeader
        title={t('title')}
        description="Create and manage menus for your restaurant. Import from existing menus or create from scratch."
        action={
          <>
            <Button variant="secondary" onClick={() => router.push('/menus/import')}>
              <FileUp />
              {t('importMenu')}
            </Button>

            <CreateMenuDialog
              restaurantName={selectedLocation.name}
              router={router}
              triggerText={t('createMenu')}
              triggerVariant="default"
            />
          </>
        }
      />
      <RestaurantMenus router={router} />
    </ContentContainer>
  )
}
