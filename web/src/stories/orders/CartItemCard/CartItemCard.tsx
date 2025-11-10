import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { CartItem } from '../shared/types'
import { Input } from '@/components/ui/input'
import { ChangeEvent } from 'react'
import { Currency, formatPrice } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

interface CartItemCardProps {
  item: CartItem
  index: number
  currency?: Currency
  onUpdateQuantity: (index: number, delta: number) => void
  onRemove: (index: number) => void
}

export function CartItemCard({ item, index, currency = Currency.USD, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const t = useTranslations('orders')
  const handleMinus = () => (item.quantity > 0) && onUpdateQuantity(index, -1)
  const handlePlus = () => (item.quantity > 0) && onUpdateQuantity(index, 1)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value)

    if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity !== item.quantity) {
      const delta = newQuantity - item.quantity
      onUpdateQuantity(index, delta)
    }
  }

  const totalPrice = item.price * item.quantity
  const unitPrice = item.price

  return (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 pr-2">{item.menuItemName}</h3>
            {item.menuItemOptionName && (
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">{item.menuItemOptionName}</p>
            )}
            {item.specialInstructions && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground italic">
                  <span className="font-medium">{t('note')}:</span> {item.specialInstructions}
                </p>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(totalPrice, currency)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(unitPrice, currency)} {t('each')}</p>
            )}
          </div>
        </div>

        <Separator className="my-2 sm:my-3" />

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMinus}
              disabled={item.quantity <= 0}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={handleInputChange}
              className="text-center w-14 sm:w-16 h-8 sm:h-9 p-0 text-sm border-primary/20 focus:border-primary/40 transition-colors"
              min={0}
            />
            <Button
              variant="default"
              size="sm"
              onClick={handlePlus}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label={t('removeItem')}
          >
            <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
