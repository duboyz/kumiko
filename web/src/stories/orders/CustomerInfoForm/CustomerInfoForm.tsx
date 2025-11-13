import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TimePicker } from '@/components/ui/time-picker'
import { CustomerInfo } from '../shared/types'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void
  minDate?: string
  maxDate?: string
  minTime?: string
  maxTime?: string
  onDateChange?: (date: string) => void
}

export function CustomerInfoForm({
  customerInfo,
  onCustomerInfoChange,
  minDate,
  maxDate,
  minTime,
  maxTime,
  onDateChange,
}: CustomerInfoFormProps) {
  const t = useTranslations('checkout')

  const handleDateChange = (date: string) => {
    onCustomerInfoChange('pickupDate', date)
    if (onDateChange) {
      onDateChange(date)
    }
  }

  // Update time to valid range when date or constraints change
  const prevDateRef = useRef<string | undefined>(customerInfo.pickupDate)
  const prevMinTimeRef = useRef<string | undefined>(minTime)
  const prevMaxTimeRef = useRef<string | undefined>(maxTime)

  useEffect(() => {
    // Only validate when date changes or constraints change, not when time changes
    const dateChanged = prevDateRef.current !== customerInfo.pickupDate
    const minTimeChanged = prevMinTimeRef.current !== minTime
    const maxTimeChanged = prevMaxTimeRef.current !== maxTime

    if ((dateChanged || minTimeChanged || maxTimeChanged) && customerInfo.pickupDate && customerInfo.pickupTime) {
      // Only update if time is actually outside bounds AND different from what we'd set
      if (minTime && customerInfo.pickupTime < minTime && customerInfo.pickupTime !== minTime) {
        onCustomerInfoChange('pickupTime', minTime)
      } else if (maxTime && customerInfo.pickupTime > maxTime && customerInfo.pickupTime !== maxTime) {
        onCustomerInfoChange('pickupTime', maxTime)
      }
    }

    // Update refs
    prevDateRef.current = customerInfo.pickupDate
    prevMinTimeRef.current = minTime
    prevMaxTimeRef.current = maxTime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerInfo.pickupDate, minTime, maxTime]) // Don't include pickupTime to avoid loops

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="customerName" className="text-sm sm:text-base">
            {t('name')} {t('requiredField')}
          </Label>
          <Input
            id="customerName"
            value={customerInfo.name}
            onChange={e => onCustomerInfoChange('name', e.target.value)}
            placeholder={t('namePlaceholder')}
            className="mt-1.5 sm:mt-2"
          />
        </div>
        <div>
          <Label htmlFor="customerPhone" className="text-sm sm:text-base">
            {t('phone')} {t('requiredField')}
          </Label>
          <Input
            id="customerPhone"
            value={customerInfo.phone}
            onChange={e => onCustomerInfoChange('phone', e.target.value)}
            placeholder={t('phonePlaceholder')}
            className="mt-1.5 sm:mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customerEmail" className="text-sm sm:text-base">
          {t('email')} {t('requiredField')}
        </Label>
        <Input
          id="customerEmail"
          type="email"
          value={customerInfo.email}
          onChange={e => onCustomerInfoChange('email', e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="mt-1.5 sm:mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="pickupDate" className="text-sm sm:text-base">
            {t('pickupDate')} {t('requiredField')}
          </Label>
          <Input
            id="pickupDate"
            type="date"
            value={customerInfo.pickupDate}
            onChange={e => handleDateChange(e.target.value)}
            min={minDate || new Date().toISOString().split('T')[0]}
            max={maxDate}
            className="mt-1.5 sm:mt-2"
          />
        </div>
        <div>
          <Label htmlFor="pickupTime" className="text-sm sm:text-base">
            {t('pickupTime')} {t('requiredField')}
          </Label>
          <div className="mt-1.5 sm:mt-2">
            <TimePicker
              value={customerInfo.pickupTime}
              onChange={value => onCustomerInfoChange('pickupTime', value)}
              min={minTime}
              max={maxTime}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="additionalNote" className="text-sm sm:text-base">
          {t('additionalNotes')}
        </Label>
        <Textarea
          id="additionalNote"
          value={customerInfo.additionalNote}
          onChange={e => onCustomerInfoChange('additionalNote', e.target.value)}
          placeholder={t('additionalNotesPlaceholder')}
          rows={3}
          className="mt-1.5 sm:mt-2"
        />
      </div>
    </div>
  )
}
