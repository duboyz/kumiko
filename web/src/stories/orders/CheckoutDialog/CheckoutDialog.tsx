import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CustomerInfoForm } from '../CustomerInfoForm'
import { CartItem, CustomerInfo } from '../shared/types'
import { Currency, formatPrice } from '@shared'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  currency?: Currency
  customerInfo: CustomerInfo
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void
  onSubmitOrder: () => void
  isSubmitting?: boolean
}

export function CheckoutDialog({
  open,
  onOpenChange,
  cart,
  currency = Currency.USD,
  customerInfo,
  onCustomerInfoChange,
  onSubmitOrder,
  isSubmitting = false,
}: CheckoutDialogProps) {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your order details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <CustomerInfoForm
            customerInfo={customerInfo}
            onCustomerInfoChange={onCustomerInfoChange}
          />

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold mb-4">
              <span>Total:</span>
              <span>{formatPrice(totalAmount, currency)}</span>
            </div>
            <Button
              onClick={onSubmitOrder}
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
