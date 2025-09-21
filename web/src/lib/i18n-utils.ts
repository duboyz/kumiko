import { locales, type Locale } from '../i18n'

// Utility to validate locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Utility to get default locale
export function getDefaultLocale(): Locale {
  return 'en'
}

// Utility to get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const localeSegment = segments[1]

  if (isValidLocale(localeSegment)) {
    return localeSegment
  }

  return getDefaultLocale()
}

// Utility to create localized path
export function createLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // Don't add locale prefix for default locale if using as-needed strategy
  if (locale === getDefaultLocale() && !cleanPath.startsWith('en/')) {
    return `/${cleanPath}`
  }

  return `/${locale}/${cleanPath}`
}