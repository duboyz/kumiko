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
 * Format a price with the correct currency symbol and position
 * @param amount The amount to format
 * @param currency The currency to use
 * @param options Optional formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  amount: number,
  currency: Currency = Currency.USD,
  options: {
    decimals?: number
    showCode?: boolean
  } = {}
): string {
  const { decimals = 2, showCode = false } = options
  const config = CURRENCY_CONFIG[currency]
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
 * @param currency The currency
 * @returns The currency symbol
 */
export function getCurrencySymbol(currency: Currency = Currency.USD): string {
  return CURRENCY_CONFIG[currency].symbol
}

/**
 * Get the currency code for a given currency
 * @param currency The currency
 * @returns The ISO currency code
 */
export function getCurrencyCode(currency: Currency = Currency.USD): string {
  return CURRENCY_CONFIG[currency].code
}