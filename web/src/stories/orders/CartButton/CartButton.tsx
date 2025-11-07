import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { CartItem } from '../shared/types'
import { Currency, formatPrice } from '@shared'

interface CartButtonProps {
  cart: CartItem[]
  currency?: Currency
  onClick: () => void
  className?: string
}

export function CartButton({ cart, currency = Currency.USD, onClick, className = '' }: CartButtonProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Button
      size="lg"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-lg z-50 text-sm sm:text-base px-3 sm:px-6 h-12 sm:h-14 ${className}`}
      disabled={cart.length === 0}
      onClick={onClick}
    >
      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
      <span className="hidden sm:inline">Cart </span>
      <span className="font-semibold">({totalItems})</span>
      {totalAmount > 0 && (
        <Badge className="ml-1.5 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5">{formatPrice(totalAmount, currency)}</Badge>
      )}
    </Button>
  )
}
