'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CustomerInfoForm } from '@/stories/orders/CustomerInfoForm'
import { useCartStore, useCreateOrder, CreateOrderItemDto, formatPrice } from '@shared'
import { toast } from 'sonner'
import { CartItemCard } from '@/stories/orders/CartItemCard'
import { ArrowLeft } from 'lucide-react'
import { PoweredByKumiko } from '@/stories/websites'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

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
    updateQuantity,
    removeItem,
  } = useCartStore()

  const createOrderMutation = useCreateOrder()

  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(field, value)
  }

  const handleSubmitOrder = async () => {
    // Validation
    if (!customerInfo.name.trim()) {
      toast.error(t('enterName'))
      return
    }
    if (!customerInfo.phone.trim()) {
      toast.error(t('enterPhone'))
      return
    }
    if (!customerInfo.email.trim()) {
      toast.error(t('enterEmail'))
      return
    }
    if (!customerInfo.pickupDate) {
      toast.error(t('selectPickupDate'))
      return
    }
    if (cart.length === 0) {
      toast.error(t('cartEmpty'))
      router.push(`/site/${subdomain}`)
      return
    }
    if (!restaurantId || !menuId) {
      toast.error(t('restaurantInfoMissing'))
      return
    }

    try {
      const orderItems: CreateOrderItemDto[] = cart.map(item => ({
        menuItemId: item.menuItemId,
        menuItemOptionId: item.menuItemOptionId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      }))

      // Format pickup date as ISO string
      const pickupDateISO = new Date(customerInfo.pickupDate).toISOString()

      // Format pickup time as HH:mm:ss
      const pickupTimeFormatted = customerInfo.pickupTime.includes(':')
        ? customerInfo.pickupTime.split(':').length === 2
          ? `${customerInfo.pickupTime}:00`
          : customerInfo.pickupTime
        : '12:00:00'

      const result = await createOrderMutation.mutateAsync({
        customerName: customerInfo.name.trim(),
        customerPhone: customerInfo.phone.trim(),
        customerEmail: customerInfo.email.trim(),
        pickupDate: pickupDateISO,
        pickupTime: pickupTimeFormatted,
        additionalNote: customerInfo.additionalNote.trim(),
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
      }
    } catch (error) {
      toast.error(t('failedToPlaceOrder'))
    }
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('cartEmpty')}</h1>
          <p className="text-gray-600">{t('addItemsFirst')}</p>
          <Button onClick={() => router.push(`/site/${subdomain}`)}>{t('backToMenu')}</Button>
        </div>
      </div>
    )
  }

  const totalAmount = getTotalAmount()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex-1">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 sm:mb-3 text-sm sm:text-base -ml-2 sm:-ml-0"
          >
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {tCommon('back')}
          </Button>
          <div className="flex items-start gap-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Left Column - Customer Info Form */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-5 lg:p-6 order-2 lg:order-1">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">{t('customerInformation')}</h2>
            <CustomerInfoForm customerInfo={customerInfo} onCustomerInfoChange={handleCustomerInfoChange} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-5 lg:p-6 order-1 lg:order-2">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">{t('orderSummary')}</h2>

            {/* Cart Items */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-3 sm:mb-4 md:mb-6 max-h-[350px] sm:max-h-[400px] md:max-h-96 overflow-y-auto -mx-3 sm:-mx-4 md:-mx-5 lg:-mx-6 px-3 sm:px-4 md:px-5 lg:px-6">
              {cart.map((item, index) => (
                <CartItemCard
                  key={index}
                  item={item}
                  index={index}
                  currency={currency}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-3 sm:pt-4">
              <div className="flex justify-between items-center text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 md:mb-6">
                <span>{t('total')}:</span>
                <span>{formatPrice(totalAmount, currency)}</span>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleSubmitOrder}
                className="w-full text-sm sm:text-base"
                size="lg"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? t('placingOrder') : t('placeOrder')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PoweredByKumiko />
    </div>
  )
}
