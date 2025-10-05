import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { CartItem } from '../shared/types'
import { Input } from '@/components/ui/input'
import { ChangeEvent } from 'react'
import { Currency, formatPrice } from '@shared'

interface CartItemCardProps {
  item: CartItem
  index: number
  currency?: Currency
  onUpdateQuantity: (index: number, delta: number) => void
  onRemove: (index: number) => void
}

export function CartItemCard({ item, index, currency = Currency.USD, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const handleMinus = () => {
    if (item.quantity > 0) onUpdateQuantity(index, -1)
  }

  const handlePlus = () => onUpdateQuantity(index, 1)


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value)

    if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity !== item.quantity) {
      const delta = newQuantity - item.quantity
      onUpdateQuantity(index, delta)
    }
  }

  const totalPrice = item.price * item.quantity

  return (
    <div className="w-full border p-4 rounded-lg border-gray-400">
      <div className="flex items-start justify-between w-full">
        <div className="flex-1">
          <h3 className="font-bold">{item.menuItemName}</h3>
          {item.menuItemOptionName && (
            <p className="text-sm text-muted-foreground">{item.menuItemOptionName}</p>
          )}
          <p className="font-medium">{formatPrice(totalPrice, currency)}</p>
          {item.specialInstructions && (
            <p className="text-sm text-muted-foreground italic">
              Note: {item.specialInstructions}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleMinus}
            disabled={item.quantity <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={handleInputChange}
            className="text-center w-12"
            min={0}
          />
          <Button variant="outline" size="icon" onClick={handlePlus}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}