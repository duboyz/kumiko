'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useMenuById } from '@shared'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface PublicRestaurantMenuSectionProps {
  restaurantMenuSectionId: string
  restaurantMenuId: string
  allowOrdering?: boolean
  className?: string
}

export function PublicRestaurantMenuSection({
  restaurantMenuSectionId,
  restaurantMenuId,
  allowOrdering = true,
  className = ''
}: PublicRestaurantMenuSectionProps) {
  const { data: menuData, isLoading, error } = useMenuById(restaurantMenuId)

  const handleAddToCart = (itemId: string, itemName: string) => {
    alert(`Not implemented yet: Adding "${itemName}" to cart`)
  }

  if (isLoading) {
    return (
      <section className={`relative py-12 px-4 md:px-6 lg:px-8 ${className}`}>
        <div className="max-w-4xl mx-auto flex justify-center">
          <LoadingSpinner />
        </div>
      </section>
    )
  }

  if (error || !menuData) {
    return (
      <section className={`relative py-12 px-4 md:px-6 lg:px-8 ${className}`}>
        <div className="max-w-4xl mx-auto text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">Menu Not Found</h3>
          <p>The selected menu could not be loaded.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative py-12 px-4 md:px-6 lg:px-8 ${className}`}>
      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {/* Menu Title and Description */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{menuData.name}</h2>
          {menuData.description && (
            <p className="text-lg text-gray-600">{menuData.description}</p>
          )}
        </div>

        {/* Menu Categories */}
        <div className="space-y-8">
          {menuData.categories
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
          {menuData.categories.length === 0 && (
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