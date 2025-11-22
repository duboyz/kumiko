'use client'

import {
  ContentContainer,
  UserSettings,
  LocationSettings,
  ContactInformationSettings,
  BusinessHoursSettings,
  SubscriptionSettings,
} from '@/components'
import { DeleteMeCard } from './DeleteMeCard'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentUser, useLocationSelection } from '@shared'
import { ErrorState, LoadingSpinner } from '@/components'
import { useTranslations } from 'next-intl'
import { User, CreditCard, Store } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

// Import Kumiko settings image from public folder
const KumikoSettingsImage = '/icons/kumiko-settings.png'

export default function SettingsPage() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: user, isLoading: isLoadingUser, error: userError } = useCurrentUser()
  const { selectedLocation } = useLocationSelection()

  if (isLoadingUser) return <LoadingSpinner />
  if (userError) return <ErrorState message={t('settings.failedToLoadUser')} />
  if (!user) return <ErrorState message={t('settings.userNotFound')} />

  const hasRestaurant = selectedLocation && selectedLocation.type === 'Restaurant' && selectedLocation.restaurant

  // Get active tab from URL or default to 'account'
  const activeTab = searchParams.get('tab') || (hasRestaurant ? 'restaurant' : 'account')

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <ContentContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img src={KumikoSettingsImage} alt={t('settings.settingsImageAlt')} width={60} height={60} className="rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{t('settings.description')}</p>
          </div>
        </div>

        {/* Tabbed Settings */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`grid w-full mb-6 ${hasRestaurant ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {hasRestaurant && (
              <TabsTrigger value="restaurant" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span>{t('settings.restaurantTab')}</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{t('settings.accountTab')}</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>{t('settings.subscriptionTab')}</span>
            </TabsTrigger>

          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserSettings />
              <LocationSettings />
              <div className="col-span-2">
                <DeleteMeCard />
              </div>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <SubscriptionSettings />
          </TabsContent>

          {/* Restaurant Tab */}
          {hasRestaurant && selectedLocation.restaurant && (
            <TabsContent value="restaurant" className="space-y-6">
              <ContactInformationSettings restaurant={selectedLocation.restaurant} />
              <BusinessHoursSettings restaurant={selectedLocation.restaurant} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ContentContainer>
  )
}
