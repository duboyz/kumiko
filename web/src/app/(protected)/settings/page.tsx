'use client'

import {
  ContentContainer,
  UserSettings,
  LocationSettings,
  ContactInformationSettings,
  BusinessHoursSettings,
  SubscriptionSettings,
} from '@/components'
import { useCurrentUser, useLocationSelection } from '@shared'
import { ErrorState, LoadingSpinner } from '@/components'
import { useTranslations } from 'next-intl'

export default function SettingsPage() {
  const t = useTranslations()
  const { data: user, isLoading: isLoadingUser, error: userError } = useCurrentUser()
  const { selectedLocation } = useLocationSelection()

  if (isLoadingUser) return <LoadingSpinner />
  if (userError) return <ErrorState message="Failed to load user data" />
  if (!user) return <ErrorState message="User not found" />

  return (
    <ContentContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {/* Account Settings Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserSettings />
            <LocationSettings />
          </div>
        </div>

        {/* Subscription Settings Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <SubscriptionSettings />
        </div>

        {/* Restaurant Settings Section */}
        {selectedLocation && selectedLocation.type === 'Restaurant' && selectedLocation.restaurant && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Restaurant</h2>
            <ContactInformationSettings restaurant={selectedLocation.restaurant} />
            <BusinessHoursSettings restaurant={selectedLocation.restaurant} />
          </div>
        )}
      </div>
    </ContentContainer>
  )
}
