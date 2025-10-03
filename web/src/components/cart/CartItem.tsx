'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart, type CartItem as CartItemType } from '@/contexts/CartContext'
import { useState } from 'react'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, updateInstructions } = useCart()
  const [showInstructions, setShowInstructions] = useState(!!item.specialInstructions)

  return (
    <div className="py-4 border-b">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{item.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive"
            onClick={() => removeItem(item.menuItemId)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="mt-2">
        {!showInstructions ? (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => setShowInstructions(true)}
          >
            Add special instructions
          </Button>
        ) : (
          <Textarea
            placeholder="Special instructions..."
            value={item.specialInstructions || ''}
            onChange={e => updateInstructions(item.menuItemId, e.target.value)}
            className="text-xs h-16 mt-1"
          />
        )}
      </div>

      <div className="mt-2 text-right">
        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}
