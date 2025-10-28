'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { GetMenuByIdResult, Currency, useCartStore } from '@shared'
import { toast } from 'sonner'
import { CartButton } from '../CartButton'
import { CartDialog } from '../CartDialog'
import { MenuDisplay } from '../MenuDisplay'

interface OrderFormProps {
  menu: GetMenuByIdResult
  restaurantId: string
  currency?: Currency
  className?: string
}

export function OrderForm({ menu, restaurantId, currency = Currency.USD, className = '' }: OrderFormProps) {
  const params = useParams()
  const router = useRouter()
  const subdomain = params.subdomain as string

  const {
    cart,
    addToCart: addToCartStore,
    updateQuantity,
    removeItem,
    setRestaurantContext,
  } = useCartStore()

  const [isCartOpen, setIsCartOpen] = useState(false)

  // Set restaurant context when component mounts
  useEffect(() => {
    setRestaurantContext(restaurantId, menu.id, currency)
  }, [restaurantId, menu.id, currency, setRestaurantContext])

  const addToCart = (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => {
    addToCartStore(menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName)
    toast.success(`Added ${menuItemName} to cart`)
  }

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    router.push(`/site/${subdomain}/checkout`)
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
          onProceedToCheckout={handleProceedToCheckout}
        />
      </Dialog>

      {/* Menu Display */}
      <MenuDisplay menu={menu} currency={currency} onAddToCart={addToCart} />
    </div>
  )
}

