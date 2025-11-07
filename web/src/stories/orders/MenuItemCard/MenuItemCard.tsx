import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Minus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { GetMenuByIdResult, Currency, formatPrice, useCartStore } from '@shared'
import { useState } from 'react'

interface MenuItemCardProps {
  item: NonNullable<GetMenuByIdResult['categories'][0]['menuCategoryItems'][0]['menuItem']>
  currency?: Currency
  onAddToCart: (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => void
}

export function MenuItemCard({ item, currency = Currency.USD, onAddToCart }: MenuItemCardProps) {
  const [showOptions, setShowOptions] = useState(false)
  const { cart, updateQuantity, removeItem } = useCartStore()

  if (!item.isAvailable) return null

  const hasOptions = item.hasOptions && item.options.length > 0
  const hasAllergens = item.allergens && item.allergens.length > 0

  // Helper function to get quantity from cart
  const getItemQuantity = (menuItemId: string, menuItemOptionId?: string) => {
    const cartItem = cart.find(item => item.menuItemId === menuItemId && item.menuItemOptionId === menuItemOptionId)
    return cartItem?.quantity || 0
  }

  // Helper function to get cart index
  const getCartItemIndex = (menuItemId: string, menuItemOptionId?: string) => {
    return cart.findIndex(item => item.menuItemId === menuItemId && item.menuItemOptionId === menuItemOptionId)
  }

  // Handle quantity decrease
  const handleDecrease = (menuItemId: string, menuItemOptionId?: string) => {
    const index = getCartItemIndex(menuItemId, menuItemOptionId)
    if (index >= 0) {
      const currentQuantity = cart[index].quantity
      if (currentQuantity === 1) {
        removeItem(index)
      } else {
        updateQuantity(index, -1)
      }
    }
  }

  // Handle quantity increase
  const handleIncrease = (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => {
    onAddToCart(menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName)
  }

  const mainItemQuantity = getItemQuantity(item.id)

  return (
    <Card className="group overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 sm:p-5 md:p-6 relative">
        {/* Header with name, price */}
        <div className="flex justify-between items-start gap-3 sm:gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors pr-2">
              {item.name}
            </h4>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent whitespace-nowrap">
              {item.price !== null && item.price !== undefined ? formatPrice(item.price, currency) : ''}
            </span>
          </div>
        </div>

        {item.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Allergens - compact display */}
        {hasAllergens && (
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {item.allergens.slice(0, 3).map(allergen => (
                <Badge
                  key={allergen.id}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  {allergen.name}
                </Badge>
              ))}
              {item.allergens.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border-amber-200">
                  +{item.allergens.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Main action button with quantity controls - separate row on mobile to prevent width changes */}
        {!hasOptions && (
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 mt-3 sm:mt-0">
            {/* Smooth slide-in animation for quantity controls */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ease-out ${
                mainItemQuantity > 0
                  ? 'opacity-100 translate-x-0 max-w-[100px] sm:max-w-[120px]'
                  : 'opacity-0 -translate-x-4 max-w-0 overflow-hidden pointer-events-none'
              }`}
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDecrease(item.id)}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                disabled={mainItemQuantity === 0}
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Input
                type="number"
                value={mainItemQuantity}
                readOnly
                className="w-12 sm:w-14 h-8 sm:h-9 text-center p-0 text-sm font-semibold border-primary/20 focus:border-primary/40 transition-all bg-background flex-shrink-0"
              />
            </div>
            <Button
              size="sm"
              onClick={() => handleIncrease(item.id, item.name, item.price || 0)}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30 relative overflow-hidden group/btn"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:rotate-90" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        )}

        {/* Options section */}
        {hasOptions && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="w-full justify-between p-2.5 sm:p-3 h-auto hover:bg-muted/30 active:scale-100 focus:scale-100 hover:scale-100 transition-colors rounded-lg"
            >
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {item.options.length} option{item.options.length !== 1 ? 's' : ''} available
              </span>
              {showOptions ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </Button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showOptions ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2.5 sm:space-y-3 border-t border-border/50 pt-3 sm:pt-4">
                {item.options
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map(option => {
                    const optionQuantity = getItemQuantity(item.id, option.id)
                    return (
                      <div
                        key={option.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-xs sm:text-sm font-medium text-foreground">{option.name}</span>
                            {option.description && (
                              <span className="text-xs text-muted-foreground truncate">{option.description}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent whitespace-nowrap">
                            {formatPrice(option.price, currency)}
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {optionQuantity > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDecrease(item.id, option.id)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            )}
                            {optionQuantity > 0 && (
                              <Input
                                type="number"
                                value={optionQuantity}
                                readOnly
                                className="w-10 sm:w-12 h-7 sm:h-8 text-center p-0 text-xs sm:text-sm border-primary/20 focus:border-primary/40 transition-colors"
                              />
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleIncrease(item.id, item.name, option.price, option.id, option.name)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
