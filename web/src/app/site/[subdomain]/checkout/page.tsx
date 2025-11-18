'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CustomerInfoForm } from '@/stories/orders/CustomerInfoForm'
import { CustomerAuthSection } from '@/stories/orders/CustomerAuthSection'
import {
  useCartStore,
  useCreateOrder,
  CreateOrderItemDto,
  formatPrice,
  useWebsiteBySubdomain,
  parseBusinessHours,
  getMinDate,
  getMinTime,
  getMaxTime,
  isDateAvailable,
  useCustomerAuthStore,
} from '@shared'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { PoweredByKumiko } from '@/stories/websites'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMemo, useState, useEffect } from 'react'

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const subdomain = params.subdomain as string

  const {
    cart,
    customerInfo,
    restaurantId,
    menuId,
    currency,
    setCustomerInfo,
    clearCart,
    clearCustomerInfo,
    getTotalAmount,
  } = useCartStore()

  const { customer, isAuthenticated } = useCustomerAuthStore()
  const { data: websiteData } = useWebsiteBySubdomain(subdomain)
  const createOrderMutation = useCreateOrder()

  // Checkout step state: 'auth' or 'info'
  const [checkoutStep, setCheckoutStep] = useState<'auth' | 'info'>('auth')

  // Skip auth step if already authenticated
  useEffect(() => {
    if (isAuthenticated && customer) {
      setCheckoutStep('info')
    }
  }, [isAuthenticated, customer])

  // Pre-fill customer info when logged in
  useEffect(() => {
    if (isAuthenticated && customer) {
      // Only pre-fill if fields are empty
      if (!customerInfo.name) {
        setCustomerInfo('name', `${customer.firstName} ${customer.lastName}`.trim())
      }
      if (!customerInfo.email) {
        setCustomerInfo('email', customer.email)
      }
      if (!customerInfo.phone && customer.phoneNumber) {
        setCustomerInfo('phone', customer.phoneNumber)
      }
    }
  }, [isAuthenticated, customer, customerInfo, setCustomerInfo])

  // Parse business hours
  const businessHours = useMemo(() => {
    return parseBusinessHours(websiteData?.businessHours)
  }, [websiteData?.businessHours])

  // Calculate min date
  const minDate = useMemo(() => {
    return getMinDate(businessHours)
  }, [businessHours])

  // Calculate min/max time for selected date
  // Only set minTime for today to prevent past times, no maxTime constraint
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return customerInfo.pickupDate || minDate || new Date().toISOString().split('T')[0]
  })

  const { minTime, maxTime } = useMemo(() => {
    // Always use business hours constraints for the selected date
    if (!selectedDate || !businessHours) {
      console.log('[Checkout] No selectedDate or businessHours', { selectedDate, businessHours })
      return { minTime: undefined, maxTime: undefined }
    }

    // Parse date in local timezone to avoid timezone issues
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()]

    console.log('[Checkout] Calculating time constraints', {
      selectedDate,
      dayName,
      businessHoursForDay: businessHours[dayName],
      allBusinessHours: businessHours,
    })

    // Check if restaurant is open on this date
    if (!isDateAvailable(date, businessHours)) {
      console.log('[Checkout] Restaurant closed on selected date')
      // If closed, no time constraints (date validation will catch this)
      return { minTime: undefined, maxTime: undefined }
    }

    // Get min and max times based on business hours
    const min = getMinTime(date, businessHours)
    const max = getMaxTime(date, businessHours)

    console.log('[Checkout] Calculated times', { min, max })

    // If either is undefined, return undefined for both (shouldn't happen if isDateAvailable passed)
    if (!min || !max) {
      console.log('[Checkout] Min or max is undefined, returning undefined')
      return { minTime: undefined, maxTime: undefined }
    }

    return { minTime: min, maxTime: max }
  }, [selectedDate, businessHours])

  const handleDateChange = (date: string) => {
    if (!date) return

    // Parse date in local timezone
    const [year, month, day] = date.split('-').map(Number)
    const selectedDateObj = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDateObj.setHours(0, 0, 0, 0)

    // Validate that the date is not in the past
    if (selectedDateObj < today) {
      const errorMessage = t('dateInPast') || 'Cannot select a date in the past. Please select today or a future date.'
      toast.error(errorMessage)
      setValidationErrors(prev => ({
        ...prev,
        pickupDate: errorMessage,
      }))
      // Reset to today or next available date
      const validDate = getMinDate(businessHours)
      setSelectedDate(validDate)
      setCustomerInfo('pickupDate', validDate)
      return
    }

    // Validate that the selected date is available (restaurant is open)
    if (businessHours && !isDateAvailable(selectedDateObj, businessHours)) {
      const errorMessage = t('restaurantClosedOnDate')
      toast.error(errorMessage)
      // Set validation error
      setValidationErrors(prev => ({
        ...prev,
        pickupDate: errorMessage,
      }))
      // Reset to a valid date
      const validDate = getMinDate(businessHours)
      setSelectedDate(validDate)
      setCustomerInfo('pickupDate', validDate)
      return
    }

    // Clear error if date is valid
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.pickupDate
      return newErrors
    })
    setSelectedDate(date)
    setCustomerInfo('pickupDate', date)
  }

  // Update selectedDate when minDate changes (if current date is invalid)
  useEffect(() => {
    if (minDate && (!selectedDate || selectedDate < minDate)) {
      setSelectedDate(minDate)
      if (!customerInfo.pickupDate || customerInfo.pickupDate < minDate) {
        setCustomerInfo('pickupDate', minDate)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate]) // Only depend on minDate to avoid loops

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(field, value)
    // Clear error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    if (!customerInfo.name.trim()) {
      errors.name = t('enterName')
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = t('enterPhone')
    }
    if (!customerInfo.email.trim()) {
      errors.email = t('enterEmail')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = t('invalidEmail') || 'Please enter a valid email address'
    }
    if (!customerInfo.pickupDate) {
      errors.pickupDate = t('selectPickupDate')
    } else if (businessHours) {
      // Validate that the selected date is available (restaurant is open)
      const pickupDateObj = new Date(customerInfo.pickupDate)
      if (!isDateAvailable(pickupDateObj, businessHours)) {
        errors.pickupDate = t('restaurantClosedOnDate')
      }
    }
    if (!customerInfo.pickupTime) {
      errors.pickupTime = t('selectPickupTime') || 'Please select a pickup time'
    } else {
      // If time is set, validate it's within business hours (unless it's the ASAP time which is minTime)
      // The ASAP option automatically sets minTime, so we only validate if it's not minTime
    }

    // Validate time is within business hours for the selected date
    if (customerInfo.pickupDate && customerInfo.pickupTime && businessHours) {
      const [year, month, day] = customerInfo.pickupDate.split('-').map(Number)
      const pickupDate = new Date(year, month - 1, day)

      // Check if restaurant is open on this date
      if (isDateAvailable(pickupDate, businessHours)) {
        const min = getMinTime(pickupDate, businessHours)
        const max = getMaxTime(pickupDate, businessHours)

        if (min && customerInfo.pickupTime < min) {
          errors.pickupTime = t('pickupTimeInPast') || 'Pickup time cannot be in the past. Please select a later time.'
        } else if (max && customerInfo.pickupTime > max) {
          errors.pickupTime =
            t('pickupTimeAfterClosing') || 'Pickup time is after closing time. Please select an earlier time.'
        }
      }
    }

    setValidationErrors(errors)
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const handleSubmitOrder = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()

    // Validate form
    const { isValid, errors } = validateForm()

    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        // Map error field names to actual input IDs
        const fieldIdMap: Record<string, string> = {
          name: 'customerName',
          phone: 'customerPhone',
          email: 'customerEmail',
          pickupDate: 'pickupDate',
          pickupTime: 'pickupTime',
        }
        const elementId = fieldIdMap[firstErrorField] || firstErrorField
        // Use setTimeout to ensure DOM is updated with error messages
        setTimeout(() => {
          const element = document.getElementById(elementId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.focus()
          }
        }, 100)
      }
      // Show a general toast message
      const firstError = Object.values(errors)[0]
      toast.error(firstError)
      return
    }

    if (cart.length === 0) {
      toast.error(t('cartEmpty'))
      router.push('/menu')
      return
    }
    if (!restaurantId || !menuId) {
      toast.error(t('restaurantInfoMissing'))
      return
    }

    try {
      // Validate required fields before proceeding
      if (!customerInfo.pickupDate) {
        toast.error(t('selectPickupDate') || 'Please select a pickup date')
        return
      }

      if (!customerInfo.pickupTime) {
        toast.error(t('selectPickupTime') || 'Please select a pickup time')
        return
      }

      const orderItems: CreateOrderItemDto[] = cart.map(item => ({
        menuItemId: item.menuItemId,
        menuItemOptionId: item.menuItemOptionId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      }))

      // Format pickup date as ISO string
      // Parse date in local timezone to avoid timezone issues
      const [year, month, day] = customerInfo.pickupDate.split('-').map(Number)
      const pickupDateObj = new Date(year, month - 1, day)

      if (isNaN(pickupDateObj.getTime())) {
        toast.error('Invalid pickup date. Please select a valid date.')
        return
      }

      const pickupDateISO = pickupDateObj.toISOString()

      // Format pickup time as HH:mm:ss
      let pickupTimeFormatted: string
      if (!customerInfo.pickupTime || customerInfo.pickupTime.trim() === '') {
        toast.error('Pickup time is required')
        return
      }

      if (customerInfo.pickupTime.includes(':')) {
        const timeParts = customerInfo.pickupTime.split(':')
        if (timeParts.length === 2) {
          // Format as HH:mm:ss
          pickupTimeFormatted = `${customerInfo.pickupTime}:00`
        } else if (timeParts.length === 3) {
          // Already in HH:mm:ss format
          pickupTimeFormatted = customerInfo.pickupTime
        } else {
          toast.error('Invalid time format')
          return
        }
      } else {
        toast.error('Invalid time format. Please select a valid time.')
        return
      }

      const result = await createOrderMutation.mutateAsync({
        customerName: customerInfo.name.trim(),
        customerPhone: customerInfo.phone.trim(),
        customerEmail: customerInfo.email.trim(),
        pickupDate: pickupDateISO,
        pickupTime: pickupTimeFormatted,
        additionalNote: customerInfo.additionalNote?.trim() || '',
        restaurantId,
        restaurantMenuId: menuId,
        orderItems,
      })

      toast.success(t('orderPlacedSuccessfully'))

      // Reset form
      clearCart()
      clearCustomerInfo()

      // Redirect to order status page
      if (result?.id) {
        router.push(`/order/${result.id}/status`)
      } else {
        console.error('Order created but no ID returned:', result)
        toast.error('Order created but could not redirect. Please check your orders.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      const errorMessage = error instanceof Error ? error.message : t('failedToPlaceOrder')
      toast.error(errorMessage)
    }
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('cartEmpty')}</h1>
          <p className="text-gray-600">{t('addItemsFirst')}</p>
          <Button onClick={() => router.push(`/menu`)}>{t('backToMenu')}</Button>
        </div>
      </div>
    )
  }

  const totalAmount = getTotalAmount()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 flex-1 pb-24 sm:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-3 sm:mb-4 text-sm sm:text-base -ml-2 sm:-ml-0"
          >
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {tCommon('back')}
          </Button>
          <div className="flex items-start gap-3 sm:gap-4">
            <Image
              src="/icons/kumiko-checkout.png"
              alt="Kumiko"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">{t('completeOrderDetails')}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {checkoutStep === 'auth' ? (
            /* Customer Authentication Section - First Step */
            <CustomerAuthSection
              onContinueAsGuest={() => setCheckoutStep('info')}
              onAuthenticated={() => setCheckoutStep('info')}
            />
          ) : (
            /* Customer Info Form - Second Step */
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 lg:p-6 flex flex-col">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl md:text-xl font-semibold">Customer Information</h2>
                {!isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCheckoutStep('auth')}
                    className="mt-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    ← Back to sign in
                  </Button>
                )}
              </div>
              <CustomerInfoForm
                customerInfo={customerInfo}
                onCustomerInfoChange={handleCustomerInfoChange}
                minDate={minDate}
                minTime={minTime}
                maxTime={maxTime}
                onDateChange={handleDateChange}
                errors={validationErrors}
              />

              {/* Total and Place Order Button - Desktop/Tablet */}
              <div className="hidden md:block mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-700">Total:</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(totalAmount, currency)}</span>
                </div>
                <Button
                  type="button"
                  onClick={handleSubmitOrder}
                  className="w-full text-base font-semibold"
                  size="lg"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Total and Place Order Button - Mobile only */}
      {checkoutStep === 'info' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="px-4 pt-3 pb-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-semibold text-gray-700">Total:</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(totalAmount, currency)}</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Button
              type="button"
              onClick={handleSubmitOrder}
              className="w-full text-base font-semibold"
              size="lg"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      )}

      <PoweredByKumiko />
    </div>
  )
}
