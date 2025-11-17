'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { GetMenuByIdResult, Currency, useCartStore } from '@shared'
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
    // toast.success(`Added ${menuItemName} to cart`)
  }

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    // When accessed via subdomain (e.g., subdomain.localhost), just use /checkout
    // The middleware will handle the rewrite
    router.push('/checkout')
  }

  return (
    <section className={`relative py-20 px-10 bg-white ${className}`}>
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

      {/* Content with max-width constraint for desktop */}
      <div className="max-w-[1000px] mx-auto">
        {/* Menu Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-4xl font-light mb-4">{menu.name}</h2>
          {menu.description && (
            <p className="text-base text-muted-foreground">{menu.description}</p>
          )}
        </div>

        {/* Menu Display */}
        <MenuDisplay menu={menu} currency={currency} onAddToCart={addToCart} />
      </div>
    </section>
  )
}

