'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CustomerInfoForm } from '@/stories/orders/CustomerInfoForm'
import { useCartStore, useCreateOrder, CreateOrderItemDto, formatPrice } from '@shared'
import { toast } from 'sonner'
import { CartItemCard } from '@/stories/orders/CartItemCard'
import { ArrowLeft } from 'lucide-react'
import { PoweredByKumiko } from '@/stories/websites'

export default function CheckoutPage() {
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
      toast.error('Please enter your name')
      return
    }
    if (!customerInfo.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    if (!customerInfo.email.trim()) {
      toast.error('Please enter your email')
      return
    }
    if (!customerInfo.pickupDate) {
      toast.error('Please select a pickup date')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      router.push(`/site/${subdomain}`)
      return
    }
    if (!restaurantId || !menuId) {
      toast.error('Restaurant information is missing')
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

      toast.success('Order placed successfully! Redirecting to order status...')

      // Reset form
      clearCart()
      clearCustomerInfo()

      // Redirect to order status page
      if (result?.id) {
        router.push(`/order/${result.id}/status`)
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    }
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-600">Add items to your cart before checking out.</p>
          <Button onClick={() => router.push(`/site/${subdomain}`)}>Back to Menu</Button>
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
            Back
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">Complete your order details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Left Column - Customer Info Form */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-5 lg:p-6 order-2 lg:order-1">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Customer Information</h2>
            <CustomerInfoForm customerInfo={customerInfo} onCustomerInfoChange={handleCustomerInfoChange} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-5 lg:p-6 order-1 lg:order-2">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>

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
                <span>Total:</span>
                <span>{formatPrice(totalAmount, currency)}</span>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleSubmitOrder}
                className="w-full text-sm sm:text-base"
                size="lg"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PoweredByKumiko />
    </div>
  )
}
