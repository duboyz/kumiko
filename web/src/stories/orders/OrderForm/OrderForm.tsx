'use client'

import { useState } from 'react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { GetMenuByIdResult, useCreateOrder, CreateOrderItemDto, Currency } from '@shared'
import { toast } from 'sonner'
import { CartButton } from '../CartButton'
import { CartDialog } from '../CartDialog'
import { CheckoutDialog } from '../CheckoutDialog'
import { MenuDisplay } from '../MenuDisplay'
import { CartItem, CustomerInfo } from '../shared/types'

interface OrderFormProps {
  menu: GetMenuByIdResult
  restaurantId: string
  currency?: Currency
  className?: string
}

export function OrderForm({ menu, restaurantId, currency = Currency.USD, className = '' }: OrderFormProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  // Customer info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    pickupDate: '',
    pickupTime: '12:00',
    additionalNote: '',
  })

  const createOrderMutation = useCreateOrder()

  const addToCart = (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => {
    const existingIndex = cart.findIndex(
      item => item.menuItemId === menuItemId && item.menuItemOptionId === menuItemOptionId
    )

    if (existingIndex >= 0) {
      const newCart = [...cart]
      newCart[existingIndex].quantity += 1
      setCart(newCart)
    } else {
      setCart([
        ...cart,
        {
          menuItemId,
          menuItemName,
          menuItemOptionId,
          menuItemOptionName,
          price,
          quantity: 1,
        },
      ])
    }
    toast.success(`Added ${menuItemName} to cart`)
  }

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart]
    newCart[index].quantity += delta
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const removeItem = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
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

      await createOrderMutation.mutateAsync({
        customerName: customerInfo.name.trim(),
        customerPhone: customerInfo.phone.trim(),
        customerEmail: customerInfo.email.trim(),
        pickupDate: pickupDateISO,
        pickupTime: pickupTimeFormatted,
        additionalNote: customerInfo.additionalNote.trim(),
        restaurantId,
        restaurantMenuId: menu.id,
        orderItems,
      })

      toast.success('Order placed successfully!')
      
      // Reset form
      setCart([])
      setCustomerInfo({
        name: '',
        phone: '',
        email: '',
        pickupDate: '',
        pickupTime: '12:00',
        additionalNote: '',
      })
      setIsCheckoutOpen(false)
      setIsCartOpen(false)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    }
  }

  return (
    <div className={className}>
      {/* Floating Cart Button */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogTrigger asChild>
          <CartButton cart={cart} currency={currency} onClick={() => setIsCartOpen(true)} />
        </DialogTrigger>
        <CartDialog
          open={isCartOpen}
          onOpenChange={setIsCartOpen}
          cart={cart}
          currency={currency}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onProceedToCheckout={() => setIsCheckoutOpen(true)}
        />
      </Dialog>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        cart={cart}
        currency={currency}
        customerInfo={customerInfo}
        onCustomerInfoChange={handleCustomerInfoChange}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={createOrderMutation.isPending}
      />

      {/* Menu Display */}
      <MenuDisplay menu={menu} currency={currency} onAddToCart={addToCart} />
    </div>
  )
}

