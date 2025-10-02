'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Language } from '@shared'
import { useUpdateUserSettings } from '@shared'

const localeMap = {
  en: Language.English,
  no: Language.Norwegian,
  sv: Language.Swedish,
  da: Language.Danish,
  th: Language.Thai,
}

export function LanguageSelector() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const updateUserSettings = useUpdateUserSettings()

  const handleLanguageChange = async (newLocale: string) => {
    // Update user settings in backend
    const language = localeMap[newLocale as keyof typeof localeMap]
    if (language) {
      try {
        await updateUserSettings.mutateAsync({ preferredLanguage: language })

        document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`
        router.refresh()
      } catch (error) {
        console.error('Failed to update user language preference:', error)
      }
    }
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('settings.selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('languages.en')}</SelectItem>
        <SelectItem value="no">{t('languages.no')}</SelectItem>
        <SelectItem value="sv">{t('languages.sv')}</SelectItem>
        <SelectItem value="da">{t('languages.da')}</SelectItem>
        <SelectItem value="th">{t('languages.th')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
