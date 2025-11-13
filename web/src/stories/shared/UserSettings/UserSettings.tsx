'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCurrentUser, useUpdateUserSettings, Language } from '@shared'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function UserSettings() {
    const t = useTranslations()
    const { data: user } = useCurrentUser()
    const updateUserSettings = useUpdateUserSettings()

    const [userLanguage, setUserLanguage] = useState<Language | null>(null)

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

    // Use user data directly for initial values, local state only for changes
    const currentUserLanguage = userLanguage !== null ? userLanguage : convertLanguageFromApi(user?.preferredLanguage)

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
            toast.error(t('settings.failedToUpdateLanguage'))
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.userSettings')}</CardTitle>
                <CardDescription>{t('settings.userSettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Label className="text-sm font-medium">{t('settings.preferredLanguage')}</Label>
                    <div className="flex gap-2">
                        <Select
                            value={currentUserLanguage.toString()}
                            onValueChange={value => setUserLanguage(Number(value) as Language)}
                        >
                            <SelectTrigger className="flex-1">
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
                            size="sm"
                            disabled={
                                updateUserSettings.isPending ||
                                userLanguage === null ||
                                currentUserLanguage === user?.preferredLanguage
                            }
                        >
                            {updateUserSettings.isPending ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
