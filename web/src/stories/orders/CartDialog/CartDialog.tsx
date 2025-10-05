import { Button } from '@/components/ui/button'
import { CartItemCard } from '../CartItemCard'
import { CartItem } from '../shared/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-4">
          {cart.map((item, index) => (
            <CartItemCard key={index} item={item} index={index} currency={currency} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />
          ))}

          <div>
            <span>Total:</span>
            <span>{formatPrice(totalAmount, currency)}</span>
          </div>
          <Button onClick={onProceedToCheckout}>
            Proceed to Checkout
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  )
}
