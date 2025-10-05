'use client'

import { ContentContainer, BusinessHoursDisplay, UserSettings, LocationSettings } from '@/components'
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {/* User Settings */}
        <UserSettings />

        {/* Location Settings */}
        <LocationSettings />

        {/* Business Hours Display */}
        {selectedLocation && selectedLocation.type === 'Restaurant' && (
          <BusinessHoursDisplay
            businessHours={selectedLocation.businessHours}
            isOpenNow={selectedLocation.isOpenNow}
          />
        )}
      </div>

    </ContentContainer>
  )
}
