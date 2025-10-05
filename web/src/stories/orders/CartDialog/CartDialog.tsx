import { Button } from '@/components/ui/button'
import { CartItemCard } from '../CartItemCard'
import { CartItem } from '../shared/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'

interface CartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  onUpdateQuantity: (index: number, delta: number) => void
  onRemoveItem: (index: number) => void
  onProceedToCheckout: () => void
}

export function CartDialog({
  open,
  onOpenChange,
  cart,
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
            <CartItemCard key={index} item={item} index={index} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />
          ))}

          <div>
            <span>Total:</span>
            <span>kr {totalAmount.toFixed(2)}</span>
          </div>
          <Button onClick={onProceedToCheckout}>
            Proceed to Checkout
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  )
}
