'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Settings, ShoppingCart } from 'lucide-react'
import { RestaurantMenuDto } from '@shared/types'
import { cn } from '@/lib/utils'

interface RestaurantMenuSectionProps {
  restaurantMenu: RestaurantMenuDto
  allowOrdering?: boolean
  className?: string
  isEditing?: boolean
  availableMenus?: RestaurantMenuDto[]
  currentMenuId?: string
  onUpdate?: (field: string, value: string | boolean) => void
}

export function RestaurantMenuSection({
  restaurantMenu,
  allowOrdering = true,
  className = '',
  isEditing = false,
  availableMenus = [],
  currentMenuId,
  onUpdate
}: RestaurantMenuSectionProps) {
  const handleAddToCart = (itemId: string, itemName: string) => {
    alert(`Not implemented yet: Adding "${itemName}" to cart`)
  }

  return (
    <section className={`relative py-12 px-4 md:px-6 lg:px-8 ${className}`}>
      {/* Floating Edit Button */}
      {isEditing && onUpdate && (
        <div className="absolute top-0 right-0 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white shadow-lg border-gray-300">
                <Settings className="w-4 h-4" color="#000" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-900 mb-3">Menu Section Settings</h4>

                {/* Menu Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Select Menu</label>
                  <Select
                    value={currentMenuId || restaurantMenu.id}
                    onValueChange={(value) => onUpdate?.('restaurantMenuId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMenus.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {menu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Allow Ordering Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-ordering"
                    checked={allowOrdering}
                    onCheckedChange={(checked: boolean) => onUpdate?.('allowOrdering', checked)}
                  />
                  <Label htmlFor="allow-ordering" className="text-sm font-medium text-gray-700">
                    Allow ordering
                  </Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {/* Menu Title and Description */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{restaurantMenu.name}</h2>
          {restaurantMenu.description && (
            <p className="text-lg text-gray-600">{restaurantMenu.description}</p>
          )}
        </div>

        {/* Menu Categories */}
        <div className="space-y-8">
          {restaurantMenu.categories
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((category) => (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  {category.menuCategoryItems
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((categoryItem) => (
                      <div
                        key={categoryItem.id}
                        className="flex justify-between items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900">
                                {categoryItem.menuItem?.name}
                              </h4>
                              {categoryItem.menuItem?.description && (
                                <p className="text-gray-600 mt-1 text-sm">
                                  {categoryItem.menuItem.description}
                                </p>
                              )}
                              {!categoryItem.menuItem?.isAvailable && (
                                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                  Currently unavailable
                                </span>
                              )}
                            </div>

                            <div className="text-right ml-4">
                              <div className="text-lg font-semibold text-gray-900">
                                ${categoryItem.menuItem?.price.toFixed(2)}
                              </div>
                              {allowOrdering && categoryItem.menuItem?.isAvailable && (
                                <Button
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => handleAddToCart(
                                    categoryItem.menuItem?.id || '',
                                    categoryItem.menuItem?.name || ''
                                  )}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* No items in category */}
                  {category.menuCategoryItems.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No items in this category yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {/* No categories */}
          {restaurantMenu.categories.length === 0 && (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-lg">No menu categories available</p>
              <p className="text-sm">Menu items will appear here once categories are created</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}