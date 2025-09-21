import { headers } from 'next/headers'
import { locales, type Locale } from '../i18n'

export async function getLocale(): Promise<Locale> {
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'

  // Validate the locale
  if (locales.includes(locale as Locale)) {
    return locale as Locale
  }

  return 'en' // fallback to English
}