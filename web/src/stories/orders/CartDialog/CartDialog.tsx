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
      <SheetContent className="flex flex-col p-3 sm:p-4 md:p-6 w-full sm:w-[400px]">
        <SheetHeader className="pb-2 sm:pb-3 md:pb-4 border-b">
          <SheetTitle className="text-lg sm:text-xl md:text-2xl">Your Cart</SheetTitle>
          <SheetDescription className="text-xs sm:text-sm">Review your items before checkout</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-3 sm:py-4 md:py-6 space-y-2 sm:space-y-3 md:space-y-4 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <p className="text-muted-foreground text-sm sm:text-base">Your cart is empty</p>
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
          <div className="mt-auto pt-3 sm:pt-4 md:pt-6 border-t space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex justify-between items-center text-base sm:text-lg md:text-xl font-bold">
              <span className="text-foreground">Total:</span>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice(totalAmount, currency)}
              </span>
            </div>
            <Button onClick={onProceedToCheckout} className="w-full text-sm sm:text-base" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
