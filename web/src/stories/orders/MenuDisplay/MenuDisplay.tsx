import { GetMenuByIdResult, Currency } from '@shared'
import { MenuItemCard } from '../MenuItemCard'

interface MenuDisplayProps {
  menu: GetMenuByIdResult
  currency?: Currency
  onAddToCart: (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => void
  className?: string
}

export function MenuDisplay({ menu, currency = Currency.USD, onAddToCart, className = '' }: MenuDisplayProps) {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{menu.name}</h2>
        {menu.description && <p className="text-lg text-muted-foreground">{menu.description}</p>}
      </div>

      <div className="space-y-12">
        {menu.categories.map(category => (
          <div key={category.id}>
            <h3 className="text-2xl font-bold mb-6 pb-2">{category.name}</h3>
            {category.description && <p className="text-muted-foreground mb-6">{category.description}</p>}

            <div className="space-y-6">
              {category.menuCategoryItems
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map(categoryItem => {
                  const item = categoryItem.menuItem
                  if (!item) return null

                  return (
                    <MenuItemCard
                      key={categoryItem.id}
                      item={item}
                      currency={currency}
                      onAddToCart={onAddToCart}
                    />
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
