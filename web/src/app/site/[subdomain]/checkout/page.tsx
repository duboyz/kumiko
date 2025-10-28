'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CustomerInfoForm } from '@/stories/orders/CustomerInfoForm'
import { useCartStore, useCreateOrder, CreateOrderItemDto, formatPrice } from '@shared'
import { toast } from 'sonner'
import { CartItemCard } from '@/stories/orders/CartItemCard'
import { ArrowLeft } from 'lucide-react'

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
        ? (customerInfo.pickupTime.split(':').length === 2 ? `${customerInfo.pickupTime}:00` : customerInfo.pickupTime)
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
      router.push(`/order/${result.id}/status`)
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
          <Button onClick={() => router.push(`/site/${subdomain}`)}>
            Back to Menu
          </Button>
        </div>
      </div>
    )
  }

  const totalAmount = getTotalAmount()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer Info Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <CustomerInfoForm
              customerInfo={customerInfo}
              onCustomerInfoChange={handleCustomerInfoChange}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
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
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold mb-6">
                <span>Total:</span>
                <span>{formatPrice(totalAmount, currency)}</span>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleSubmitOrder}
                className="w-full"
                size="lg"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
