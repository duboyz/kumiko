import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { CartItem } from '../shared/types'

interface CartButtonProps {
  cart: CartItem[]
  onClick: () => void
  className?: string
}

export function CartButton({ cart, onClick, className = '' }: CartButtonProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Button
      size="lg"
      className={`fixed bottom-6 right-6 rounded-full shadow-lg z-50 ${className}`}
      disabled={cart.length === 0}
      onClick={onClick}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Cart ({totalItems})
      {totalAmount > 0 && <Badge className="ml-2">${totalAmount.toFixed(2)}</Badge>}
    </Button>
  )
}
