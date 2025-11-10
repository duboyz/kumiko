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
  const [searchQuery, setSearchQuery] = useState('')

  if (isLoading) return <LoadingState />
  if (error)
    return (
      <ErrorState title={t('failedToLoadMenus')} message={t('errorLoadingMenus')} />
    )

  const filteredMenus =
    menusData?.menus?.filter(
      menu =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('searchMenusPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="default">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {t('filters')}
        </Button>
      </div>

      {/* Menu Grid */}
      {filteredMenus.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('noMenusFound')}</h3>
          <p className="text-muted-foreground">{t('adjustSearchQuery')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map(menu => (
            <RestaurantMenuCard key={menu.id} menu={menu} router={router} />
          ))}
        </div>
      )}
    </div>
  )
}
