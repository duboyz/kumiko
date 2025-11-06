import { Button } from '@/components/ui/button'
import { CartItemCard } from '../CartItemCard'
import { CartItem } from '../shared/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Currency, formatPrice } from '@shared'

interface CartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  currency?: Currency
  onUpdateQuantity: (index: number, delta: number) => void
  onRemoveItem: (index: number) => void
  onProceedToCheckout: () => void
}

export function CartDialog({
  open,
  onOpenChange,
  cart,
  currency = Currency.USD,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDialogProps) {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-6 sm:p-8">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <CartItemCard
                key={index}
                item={item}
                index={index}
                currency={currency}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-auto pt-6 border-t space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-foreground">Total:</span>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice(totalAmount, currency)}
              </span>
            </div>
            <Button onClick={onProceedToCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
