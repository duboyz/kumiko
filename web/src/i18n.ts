import { getRequestConfig } from 'next-intl/server'
import { getLocale } from './lib/locale'

// Can be imported from a shared config
export const locales = ['en', 'no', 'sv', 'da', 'th'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  // Get locale from middleware headers
  const locale = await getLocale()

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Oslo',
    now: new Date()
  }
})