import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TimePicker } from '@/components/ui/time-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CustomerInfo } from '../shared/types'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void
  minDate?: string
  maxDate?: string
  minTime?: string
  maxTime?: string
  onDateChange?: (date: string) => void
  errors?: Record<string, string>
}

export function CustomerInfoForm({
  customerInfo,
  onCustomerInfoChange,
  minDate,
  maxDate,
  minTime,
  maxTime,
  onDateChange,
  errors = {},
}: CustomerInfoFormProps) {
  const t = useTranslations('checkout')
  const formRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Initialize with ASAP as default
  const [isAsap, setIsAsap] = useState(true)

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Subtle animation when form appears
  useEffect(() => {
    if (!formRef.current || !mounted) return

    const tl = gsap.timeline()
    tl.fromTo(
      formRef.current,
      { opacity: 0, x: 30, filter: 'blur(10px)' },
      {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out',
      }
    )
  }, [mounted])

  // Initialize ASAP when minDate/minTime become available
  useEffect(() => {
    if (minDate && minTime && isAsap) {
      onCustomerInfoChange('pickupDate', minDate)
      if (onDateChange) {
        onDateChange(minDate)
      }
      onCustomerInfoChange('pickupTime', minTime)
    }
  }, [minDate, minTime, isAsap]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (date: string) => {
    onCustomerInfoChange('pickupDate', date)
    if (onDateChange) {
      onDateChange(date)
    }
  }

  // Handle ASAP toggle
  const handleAsapToggle = (asap: boolean) => {
    setIsAsap(asap)
    if (asap) {
      // When ASAP is selected, set date and time to earliest available
      if (minDate) {
        onCustomerInfoChange('pickupDate', minDate)
        if (onDateChange) {
          onDateChange(minDate)
        }
      }
      if (minTime) {
        onCustomerInfoChange('pickupTime', minTime)
      }
    }
  }

  return (
    <div ref={formRef} className="space-y-3 sm:space-y-4">
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
            className={`mt-1.5 sm:mt-2 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'customerName-error' : undefined}
          />
          {errors.name && (
            <p id="customerName-error" className="text-destructive text-sm mt-1">
              {errors.name}
            </p>
          )}
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
            className={`mt-1.5 sm:mt-2 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'customerPhone-error' : undefined}
          />
          {errors.phone && (
            <p id="customerPhone-error" className="text-destructive text-sm mt-1">
              {errors.phone}
            </p>
          )}
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
          className={`mt-1.5 sm:mt-2 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'customerEmail-error' : undefined}
        />
        {errors.email && (
          <p id="customerEmail-error" className="text-destructive text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm sm:text-base mb-3 sm:mb-4 block">
          {t('pickupTime')} {t('requiredField')}
        </Label>

        {/* Two Card Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {/* Want it now! Card */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isAsap
                ? 'border-primary border-2 bg-primary/5 shadow-md scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:scale-[1.01]'
            }`}
            onClick={() => handleAsapToggle(true)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-3">
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 transition-all duration-200 ${
                  isAsap ? 'scale-110' : 'scale-100'
                }`}
              >
                <Image
                  src="/icons/kumiko-excited.png"
                  alt="Want it now!"
                  width={96}
                  height={96}
                  className={`w-full h-full object-contain transition-opacity duration-200 ${
                    isAsap ? 'opacity-100' : 'opacity-60'
                  }`}
                  priority
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg sm:text-xl mb-1">Want it now!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">As soon as possible</p>
              </div>
            </CardContent>
          </Card>

          {/* Order for later Card */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              !isAsap
                ? 'border-primary border-2 bg-primary/5 shadow-md scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:scale-[1.01]'
            }`}
            onClick={() => handleAsapToggle(false)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-3">
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 transition-all duration-200 ${
                  !isAsap ? 'scale-110' : 'scale-100'
                }`}
              >
                <Image
                  src="/icons/kumiko-orderforfuture.png"
                  alt="Order for later"
                  width={96}
                  height={96}
                  className={`w-full h-full object-contain transition-opacity duration-200 ${
                    !isAsap ? 'opacity-100' : 'opacity-60'
                  }`}
                  priority
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg sm:text-xl mb-1">Order for later</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Choose date & time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date and Time Pickers - only show when "Order for later" is selected */}
        {!isAsap && (
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
                className={`mt-1.5 sm:mt-2 ${errors.pickupDate ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={!!errors.pickupDate}
                aria-describedby={errors.pickupDate ? 'pickupDate-error' : undefined}
              />
              {errors.pickupDate && (
                <p id="pickupDate-error" className="text-destructive text-sm mt-1">
                  {errors.pickupDate}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="pickupTime" className="text-sm sm:text-base">
                {t('pickupTime')} {t('requiredField')}
              </Label>
              <div className={`mt-1.5 sm:mt-2 ${errors.pickupTime ? 'rounded-md border border-destructive p-2' : ''}`}>
                <TimePicker
                  value={customerInfo.pickupTime}
                  onChange={value => {
                    onCustomerInfoChange('pickupTime', value)
                    setIsAsap(false)
                  }}
                  min={minTime}
                  max={maxTime}
                />
              </div>
              {errors.pickupTime && (
                <p id="pickupTime-error" className="text-destructive text-sm mt-1">
                  {errors.pickupTime}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Cute message when "Want it now!" is selected */}
        {isAsap && (
          <div className="text-xs sm:text-sm text-muted-foreground text-center animate-in fade-in duration-300 bg-muted/30 rounded-lg p-3 mt-2">
            We'll prepare your order as quickly as possible!
            {minDate && <div className="mt-1 font-medium">Ready for pickup today</div>}
          </div>
        )}
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
