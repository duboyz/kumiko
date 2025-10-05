'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useLocationSelection, useUpdateRestaurantSettings, useUpdateHospitalitySettings, Currency } from '@shared'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function LocationSettings() {
    const t = useTranslations()
    const { selectedLocation } = useLocationSelection()
    const updateRestaurantSettings = useUpdateRestaurantSettings()
    const updateHospitalitySettings = useUpdateHospitalitySettings()

    const [locationCurrency, setLocationCurrency] = useState<Currency | null>(null)

    // Use location data directly for initial values, local state only for changes
    const currentLocationCurrency =
        locationCurrency !== null ? locationCurrency : selectedLocation?.currency ?? Currency.USD

    // Helper function to get currency translation key
    const getCurrencyTranslationKey = (currency: Currency): string => {
        switch (currency) {
            case Currency.EUR:
                return 'EUR'
            case Currency.USD:
                return 'USD'
            case Currency.GBP:
                return 'GBP'
            case Currency.NOK:
                return 'NOK'
            case Currency.SEK:
                return 'SEK'
            case Currency.ISK:
                return 'ISK'
            case Currency.DKK:
                return 'DKK'
            default:
                return 'USD'
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

    if (!selectedLocation) {
        return null
    }

    return (
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
                                <SelectValue>
                                    {t(`currencies.${getCurrencyTranslationKey(currentLocationCurrency)}`)}
                                </SelectValue>
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
                                currentLocationCurrency === selectedLocation?.currency
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
    )
}
