import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type NumberType = 'currency' | 'number' | 'percentage'

export const formatNumber = (
  number: number | string,
  type: NumberType = 'number',
  floatingPoints: number = 0
): string => {
  const num = typeof number === 'string' ? parseFloat(number) : number

  if (isNaN(num)) return '0'

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: floatingPoints,
        maximumFractionDigits: floatingPoints,
      }).format(num)

    case 'percentage':
      return new Intl.NumberFormat('nb-NO', {
        style: 'percent',
        minimumFractionDigits: floatingPoints,
        maximumFractionDigits: floatingPoints,
      }).format(num / 100)

    case 'number':
    default:
      return new Intl.NumberFormat('nb-NO', {
        minimumFractionDigits: floatingPoints,
        maximumFractionDigits: floatingPoints,
      }).format(num)
  }
}
