import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { GetMenuByIdResult, Currency, formatPrice, useLocationSelection } from '@shared'
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

  if (!item.isAvailable) return null

  const hasOptions = item.hasOptions && item.options.length > 0
  const hasAllergens = item.allergens && item.allergens.length > 0

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent>
        {/* Header with name, price, and main action */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h4 className="text-base font-semibold leading-tight">{item.name}</h4>
              <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                {item.price !== null && item.price !== undefined ? formatPrice(item.price, currency) : ''}
              </span>
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
            )}

            {/* Allergens - compact display */}
            {hasAllergens && (
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {item.allergens.slice(0, 3).map(allergen => (
                    <Badge key={allergen.id} variant="secondary" className="text-xs px-1.5 py-0.5">
                      {allergen.name}
                    </Badge>
                  ))}
                  {item.allergens.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      +{item.allergens.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main action button */}
          {!hasOptions && (
            <Button
              size="sm"
              onClick={() => onAddToCart(item.id, item.name, item.price || 0)}
              className="flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Options section */}
        {hasOptions && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="w-full justify-between p-2 h-auto"
            >
              <span className="text-sm font-medium">
                {item.options.length} option{item.options.length !== 1 ? 's' : ''} available
              </span>
              {showOptions ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {showOptions && (
              <div className="mt-2 space-y-2 border-t pt-2">
                {item.options
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map(option => (
                    <div key={option.id} className="flex justify-between items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{option.name}</span>
                          {option.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {option.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">
                          {formatPrice(option.price, currency)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() =>
                            onAddToCart(item.id, item.name, option.price, option.id, option.name)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
