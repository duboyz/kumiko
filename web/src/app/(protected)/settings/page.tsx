'use client'

import { ContentContainer } from '@/components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  useCurrentUser,
  useUpdateUserSettings,
  Language,
  Currency,
  useLocationSelection,
  useUpdateRestaurantSettings,
  useUpdateHospitalitySettings,
} from '@shared'
import { ErrorState, LoadingSpinner } from '@/components'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export default function SettingsPage() {
  const t = useTranslations()
  const { data: user, isLoading: isLoadingUser, error: userError } = useCurrentUser()
  const { selectedLocation } = useLocationSelection()
  const updateUserSettings = useUpdateUserSettings()
  const updateRestaurantSettings = useUpdateRestaurantSettings()
  const updateHospitalitySettings = useUpdateHospitalitySettings()

  const [userLanguage, setUserLanguage] = useState<Language | null>(null)
  const [locationCurrency, setLocationCurrency] = useState<Currency | null>(null)

  // Convert string enum values from API to numbers
  const convertLanguageFromApi = (apiLanguage: any): Language => {
    if (typeof apiLanguage === 'string') {
      switch (apiLanguage) {
        case 'Norwegian':
          return Language.Norwegian
        case 'English':
          return Language.English
        case 'Swedish':
          return Language.Swedish
        case 'Danish':
          return Language.Danish
        case 'Thai':
          return Language.Thai
        default:
          return Language.English
      }
    }
    return apiLanguage ?? Language.English
  }

  const convertCurrencyFromApi = (apiCurrency: any): Currency => {
    if (typeof apiCurrency === 'string') {
      switch (apiCurrency) {
        case 'EUR':
          return Currency.EUR
        case 'USD':
          return Currency.USD
        case 'GBP':
          return Currency.GBP
        case 'NOK':
          return Currency.NOK
        case 'SEK':
          return Currency.SEK
        case 'ISK':
          return Currency.ISK
        case 'DKK':
          return Currency.DKK
        default:
          return Currency.USD
      }
    }
    return apiCurrency ?? Currency.USD
  }

  // Use user data directly for initial values, local state only for changes
  const currentUserLanguage = userLanguage !== null ? userLanguage : convertLanguageFromApi(user?.preferredLanguage)
  const currentLocationCurrency =
    locationCurrency !== null ? locationCurrency : convertCurrencyFromApi(selectedLocation?.currency)

  const handleUserLanguageUpdate = async () => {
    if (currentUserLanguage === undefined || !user) return

    try {
      await updateUserSettings.mutateAsync({ preferredLanguage: currentUserLanguage })

      // Set locale cookie and refresh the page
      const localeMap: { [key in Language]: string } = {
        [Language.Unspecified]: 'en',
        [Language.English]: 'en',
        [Language.Norwegian]: 'no',
        [Language.Swedish]: 'sv',
        [Language.Danish]: 'da',
        [Language.Thai]: 'th',
      }
      const locale = localeMap[currentUserLanguage] || 'en'
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
      toast.success(t('settings.settingsUpdated'))

      // Reset local state to null so it uses the updated user data
      setUserLanguage(null)

      // Small delay before reload to show the success message
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to update user language:', error)
      toast.error('Failed to update language settings. Please try again.')
    }
  }

  const handleLocationCurrencyUpdate = async () => {
    if (!selectedLocation || currentLocationCurrency === undefined) return

    try {
      if (selectedLocation.type === 'Restaurant') {
        await updateRestaurantSettings.mutateAsync({
          restaurantId: selectedLocation.id,
          command: { currency: currentLocationCurrency },
        })
      } else if (selectedLocation.type === 'Hospitality') {
        await updateHospitalitySettings.mutateAsync({
          hospitalityId: selectedLocation.id,
          command: { currency: currentLocationCurrency },
        })
      }
      toast.success(t('settings.settingsUpdated'))

      // Reset local state to null so it uses the updated location data
      setLocationCurrency(null)
    } catch (error) {
      console.error('Failed to update location currency:', error)
      toast.error('Failed to update currency settings. Please try again.')
    }
  }

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
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.userSettings')}</CardTitle>
            <CardDescription>Configure your personal preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.preferredLanguage')}</Label>
              <div className="flex gap-2">
                <Select
                  value={currentUserLanguage.toString()}
                  onValueChange={value => setUserLanguage(Number(value) as Language)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t('settings.selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Language.English.toString()}>{t('languages.en')}</SelectItem>
                    <SelectItem value={Language.Norwegian.toString()}>{t('languages.no')}</SelectItem>
                    <SelectItem value={Language.Swedish.toString()}>{t('languages.sv')}</SelectItem>
                    <SelectItem value={Language.Danish.toString()}>{t('languages.da')}</SelectItem>
                    <SelectItem value={Language.Thai.toString()}>{t('languages.th')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUserLanguageUpdate}
                  disabled={
                    updateUserSettings.isPending ||
                    userLanguage === null ||
                    currentUserLanguage === user.preferredLanguage
                  }
                >
                  {updateUserSettings.isPending ? 'Updating...' : t('common.save')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        {selectedLocation && (
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.locationSettings')}</CardTitle>
              <CardDescription>
                Settings for {selectedLocation.name} ({selectedLocation.type})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.currency')}</Label>
                <div className="flex gap-2">
                  <Select
                    value={currentLocationCurrency.toString()}
                    onValueChange={value => setLocationCurrency(Number(value) as Currency)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder={t('settings.selectCurrency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Currency.USD.toString()}>{t('currencies.USD')}</SelectItem>
                      <SelectItem value={Currency.EUR.toString()}>{t('currencies.EUR')}</SelectItem>
                      <SelectItem value={Currency.GBP.toString()}>{t('currencies.GBP')}</SelectItem>
                      <SelectItem value={Currency.NOK.toString()}>{t('currencies.NOK')}</SelectItem>
                      <SelectItem value={Currency.SEK.toString()}>{t('currencies.SEK')}</SelectItem>
                      <SelectItem value={Currency.DKK.toString()}>{t('currencies.DKK')}</SelectItem>
                      <SelectItem value={Currency.ISK.toString()}>{t('currencies.ISK')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleLocationCurrencyUpdate}
                    disabled={
                      updateRestaurantSettings.isPending ||
                      updateHospitalitySettings.isPending ||
                      locationCurrency === null ||
                      currentLocationCurrency === selectedLocation.currency
                    }
                  >
                    {updateRestaurantSettings.isPending || updateHospitalitySettings.isPending
                      ? 'Updating...'
                      : t('common.save')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContentContainer>
  )
}
