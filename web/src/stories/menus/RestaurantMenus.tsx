'use client'
import { useLocationSelection } from '@shared/hooks/locationSelection.hooks'
import { useRestaurantMenus } from '@shared/hooks/menu.hooks'
import { FileUp, MenuSquare, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { LoadingState } from '@/components'
import { ErrorState } from '@/components'
import { EmptyState } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RestaurantMenuCard } from '@/stories/restaurants/RestaurantMenuCard'
import { CreateMenuDialog } from '@/components'
import { useTranslations } from 'next-intl'

const KumikoMenusImage = '/icons/kumiko-menus.png'

export const RestaurantMenus = () => {
  const t = useTranslations('menus')
  const router = useRouter()
  const { selectedLocation } = useLocationSelection()
  const { data: menusData, isLoading, error } = useRestaurantMenus(selectedLocation?.id || '')

  if (isLoading) return <LoadingState />
  if (error)
    return (
      <ErrorState title={t('failedToLoadMenus')} message={t('errorLoadingMenus')} />
    )

  if (!menusData?.menus || menusData.menus.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">{t('manageMenus')}</p>
          </div>
          <CreateMenuDialog
            restaurantName={selectedLocation?.name || ''}
            router={router}
            triggerText={t('createMenu')}
            triggerVariant="default"
          />
        </div>

        <EmptyState
          icon={MenuSquare}
          title={t('noMenusYet')}
          description={t('createFirstMenu')}
          actionComponent={
            <CreateMenuDialog
              restaurantName={selectedLocation?.name || ''}
              router={router}
              triggerText={t('createYourFirstMenu')}
              triggerVariant="default"
            />
          }
        />
      </div>
    )
  }

  const menuCount = menusData.menus.length
  const menuPlural = menuCount === 1 ? t('menu') : t('title').toLowerCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div className="flex items-center gap-4">
          <img src={KumikoMenusImage} alt="Kumiko Menus" width={80} height={80} className="rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('menusAvailable', { count: menuCount, plural: menuPlural })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <CreateMenuDialog
            restaurantName={selectedLocation?.name || ''}
            router={router}
            triggerText={t('createMenu')}
            triggerVariant="default"
          />
          <Button onClick={() => router.push('/menus/import')} size="lg">
            <FileUp className="w-4 h-4 mr-2" />
            {t('importMenu')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menusData.menus.map(menu => (
          <RestaurantMenuCard key={menu.id} menu={menu} router={router} />
        ))}
      </div>

    </div>
  )
}
