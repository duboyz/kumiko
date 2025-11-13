'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { RestaurantMenuDto, GetMenuByIdResult, Currency } from '@shared/types'
import { formatPrice } from '@shared'
import { OrderForm } from '@/stories/orders/OrderForm'

interface RestaurantMenuSectionProps {
  restaurantMenu: RestaurantMenuDto | GetMenuByIdResult
  allowOrdering?: boolean
  currency?: Currency
  className?: string
  isEditing?: boolean
  availableMenus?: RestaurantMenuDto[]
  currentMenuId?: string
  restaurantId?: string
  onUpdate?: (field: string, value: string | boolean) => void
}

export function RestaurantMenuSection({
  restaurantMenu,
  allowOrdering = true,
  currency = Currency.USD,
  className = '',
  isEditing = false,
  availableMenus = [],
  currentMenuId,
  restaurantId,
  onUpdate,
}: RestaurantMenuSectionProps) {
  const handleAddToCart = (_itemId: string, itemName: string) => {
    alert(`Not implemented yet: Adding "${itemName}" to cart`)
  }

  // Check if we can use the full OrderForm
  const canUseOrderForm =
    allowOrdering &&
    !isEditing &&
    restaurantId &&
    'categories' in restaurantMenu &&
    restaurantMenu.categories.length > 0

  // If ordering is enabled and we have all the data, use the full OrderForm
  if (canUseOrderForm) {
    return (
      <OrderForm menu={restaurantMenu as GetMenuByIdResult} restaurantId={restaurantId!} currency={currency} />
    )
  }

  return (
    <section className={`relative py-20 px-10 bg-white ${className}`}>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto">
        {/* Menu Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-4xl font-light mb-4">{restaurantMenu.name}</h2>
          {restaurantMenu.description && (
            <p className="text-base text-muted-foreground">{restaurantMenu.description}</p>
          )}
        </div>

        {/* Menu Categories */}
        <div className="flex flex-col gap-20">
          {restaurantMenu.categories
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map(category => (
              <div key={category.id} className="mb-20 last:mb-0">
                {/* Category Header */}
                <div className="mb-10 pb-4 border-b">
                  <h3 className="text-2xl font-semibold uppercase">{category.name}</h3>
                  {category.description && <p className="text-sm text-muted-foreground mt-2">{category.description}</p>}
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-8">
                  {category.menuCategoryItems
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map(categoryItem => (
                      <div key={categoryItem.id} className="flex justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-lg font-medium">{categoryItem.menuItem?.name}</h4>
                            <span className="text-base text-muted-foreground whitespace-nowrap ml-4">
                              {categoryItem.menuItem?.price !== null && categoryItem.menuItem?.price !== undefined
                                ? formatPrice(categoryItem.menuItem.price, currency)
                                : 'Variable price'}
                            </span>
                          </div>
                          {categoryItem.menuItem?.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {categoryItem.menuItem.description}
                            </p>
                          )}
                          {!categoryItem.menuItem?.isAvailable && (
                            <span className="inline-block mt-1.5 text-xs text-muted-foreground">
                              Currently unavailable
                            </span>
                          )}
                          {allowOrdering && categoryItem.menuItem?.isAvailable && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mt-3 px-4 py-2"
                              onClick={() =>
                                handleAddToCart(categoryItem.menuItem?.id || '', categoryItem.menuItem?.name || '')
                              }
                            >
                              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* No items in category */}
                  {category.menuCategoryItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No items in this category yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {/* No categories */}
          {restaurantMenu.categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed">
              <p className="text-lg">No menu categories available</p>
              <p className="text-sm">Menu items will appear here once categories are created</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
