'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from './CartItem'
import { useState } from 'react'
import { CheckoutForm } from './CheckoutForm'
import { Badge } from '@/components/ui/badge'

export function CartSheet() {
  const { items, getTotalItems, getTotalAmount, restaurantName } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = getTotalItems()
  const totalAmount = getTotalAmount()

  const handleCheckoutSuccess = () => {
    setShowCheckout(false)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{showCheckout ? 'Checkout' : 'Your Cart'}</SheetTitle>
          {restaurantName && !showCheckout && (
            <p className="text-sm text-muted-foreground">{restaurantName}</p>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-2">Add items from the menu to get started</p>
            </div>
          </div>
        ) : showCheckout ? (
          <CheckoutForm onSuccess={handleCheckoutSuccess} onBack={() => setShowCheckout(false)} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map(item => (
                <CartItem key={item.menuItemId} item={item} />
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">${totalAmount.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
