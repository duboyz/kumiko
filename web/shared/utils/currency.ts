import { Currency } from '../types/localization.types'

export interface CurrencyInfo {
  symbol: string
  code: string
  position: 'before' | 'after'
  separator: string
}

export const CURRENCY_CONFIG: Record<Currency, CurrencyInfo> = {
  [Currency.Unspecified]: {
    symbol: '$',
    code: 'USD',
    position: 'before',
    separator: '',
  },
  [Currency.USD]: {
    symbol: '$',
    code: 'USD',
    position: 'before',
    separator: '',
  },
  [Currency.EUR]: {
    symbol: '€',
    code: 'EUR',
    position: 'before',
    separator: '',
  },
  [Currency.GBP]: {
    symbol: '£',
    code: 'GBP',
    position: 'before',
    separator: '',
  },
  [Currency.NOK]: {
    symbol: 'kr',
    code: 'NOK',
    position: 'after',
    separator: ' ',
  },
  [Currency.SEK]: {
    symbol: 'kr',
    code: 'SEK',
    position: 'after',
    separator: ' ',
  },
  [Currency.DKK]: {
    symbol: 'kr',
    code: 'DKK',
    position: 'after',
    separator: ' ',
  },
  [Currency.ISK]: {
    symbol: 'kr',
    code: 'ISK',
    position: 'after',
    separator: ' ',
  },
}

/**
 * Convert currency from API string format to numeric enum
 * @param apiCurrency Currency from API (string or numeric)
 * @returns Numeric Currency enum value
 */
function normalizeCurrency(apiCurrency: Currency | string | number | undefined): Currency {
  // If it's already a valid numeric enum, return it
  if (typeof apiCurrency === 'number' && CURRENCY_CONFIG[apiCurrency as Currency]) {
    return apiCurrency as Currency
  }

  // If it's a string, convert it
  if (typeof apiCurrency === 'string') {
    switch (apiCurrency) {
      case 'EUR': return Currency.EUR
      case 'USD': return Currency.USD
      case 'GBP': return Currency.GBP
      case 'NOK': return Currency.NOK
      case 'SEK': return Currency.SEK
      case 'ISK': return Currency.ISK
      case 'DKK': return Currency.DKK
      default: return Currency.USD
    }
  }

  // Default fallback
  return Currency.USD
}

/**
 * Format a price with the correct currency symbol and position
 * @param amount The amount to format
 * @param currency The currency to use (string or numeric enum)
 * @param options Optional formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  amount: number,
  currency: Currency | string | number | undefined = Currency.USD,
  options: {
    decimals?: number
    showCode?: boolean
  } = {}
): string {
  const { decimals = 2, showCode = false } = options
  const normalizedCurrency = normalizeCurrency(currency)
  const config = CURRENCY_CONFIG[normalizedCurrency]
  const formattedAmount = amount.toFixed(decimals)

  const currencyDisplay = showCode ? config.code : config.symbol

  if (config.position === 'before') {
    return `${currencyDisplay}${config.separator}${formattedAmount}`
  } else {
    return `${formattedAmount}${config.separator}${currencyDisplay}`
  }
}

/**
 * Get the currency symbol for a given currency
 * @param currency The currency (string or numeric enum)
 * @returns The currency symbol
 */
export function getCurrencySymbol(currency: Currency | string | number | undefined = Currency.USD): string {
  const normalizedCurrency = normalizeCurrency(currency)
  return CURRENCY_CONFIG[normalizedCurrency].symbol
}

/**
 * Get the currency code for a given currency
 * @param currency The currency (string or numeric enum)
 * @returns The ISO currency code
 */
export function getCurrencyCode(currency: Currency | string | number | undefined = Currency.USD): string {
  const normalizedCurrency = normalizeCurrency(currency)
  return CURRENCY_CONFIG[normalizedCurrency].code
}

/**
 * Format a currency value with shortened notation (K for thousands, M for millions)
 * Respects currency position and separator
 * @param value The value to format
 * @param currency The currency to use (string or numeric enum)
 * @returns Formatted short currency string
 */
export function formatCurrencyShort(value: number, currency: Currency | string | number | undefined = Currency.USD): string {
  const normalizedCurrency = normalizeCurrency(currency)
  const config = CURRENCY_CONFIG[normalizedCurrency]
  const symbol = config.symbol

  let formattedNumber: string

  if (value >= 1000000) {
    formattedNumber = `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    formattedNumber = `${(value / 1000).toFixed(1)}K`
  } else {
    formattedNumber = value.toFixed(0)
  }

  if (config.position === 'before') {
    return `${symbol}${formattedNumber}`
  } else {
    return `${formattedNumber}${config.separator}${symbol}`
  }
}