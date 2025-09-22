import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { KumikoHeading } from "../../atoms/KumikoHeading"
import { KumikoText } from "../../atoms/KumikoText"
import { KumikoButton } from "../../atoms/KumikoButton"
import { EmptyState } from "../../molecules/EmptyState"

const restaurantMenuSectionVariants = cva(
  "relative w-full",
  {
    variants: {
      layout: {
        grid: "space-y-12",
        list: "space-y-8",
        compact: "space-y-6",
      },
      spacing: {
        compact: "py-12 px-6",
        normal: "py-16 px-6 lg:py-20",
        spacious: "py-24 px-6 lg:py-32",
      },
    },
    defaultVariants: {
      layout: "grid",
      spacing: "normal",
    },
  }
)

const menuItemVariants = cva(
  "group transition-all duration-normal",
  {
    variants: {
      variant: {
        card: "py-6 border-b border-kumiko-gray-50 last:border-b-0 hover:bg-kumiko-gray-25",
        minimal: "py-4 border-b border-kumiko-gray-25 last:border-b-0 hover:bg-kumiko-gray-25",
        clean: "py-5 hover:bg-kumiko-gray-25",
      },
      availability: {
        available: "",
        unavailable: "opacity-50",
      },
    },
    defaultVariants: {
      variant: "card",
      availability: "available",
    },
  }
)

// Basic types for menu data structure
export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  isAvailable?: boolean
  imageUrl?: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  items: MenuItem[]
  orderIndex?: number
}

export interface RestaurantMenu {
  id: string
  name: string
  description?: string
  categories: MenuCategory[]
}

export interface RestaurantMenuSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof restaurantMenuSectionVariants> {
  menu: RestaurantMenu
  allowOrdering?: boolean
  showPrices?: boolean
  showImages?: boolean
  itemVariant?: "card" | "minimal" | "clean"
  onAddToCart?: (item: MenuItem) => void
  onItemClick?: (item: MenuItem) => void
}

const RestaurantMenuSection = React.forwardRef<HTMLElement, RestaurantMenuSectionProps>(
  ({
    className,
    menu,
    allowOrdering = true,
    showPrices = true,
    showImages = false,
    itemVariant = "card",
    layout,
    spacing,
    onAddToCart,
    onItemClick,
    ...props
  }, ref) => {
    const handleAddToCart = (item: MenuItem) => {
      if (onAddToCart) {
        onAddToCart(item)
      } else {
        // Default behavior - could be overridden by parent
        console.log(`Adding ${item.name} to cart`)
      }
    }

    const handleItemClick = (item: MenuItem) => {
      if (onItemClick) {
        onItemClick(item)
      }
    }

    // Show empty state if no categories
    if (!menu.categories || menu.categories.length === 0) {
      return (
        <section
          ref={ref}
          className={cn(restaurantMenuSectionVariants({ layout, spacing, className }))}
          {...props}
        >
          <div className="max-w-4xl mx-auto">
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              title="No Menu Available"
              subtitle="Menu categories and items will appear here"
              size="base"
            />
          </div>
        </section>
      )
    }

    const sortedCategories = menu.categories
      .slice()
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))

    return (
      <section
        ref={ref}
        className={cn(restaurantMenuSectionVariants({ layout, spacing, className }))}
        {...props}
      >
        <div className="max-w-4xl mx-auto">
          {/* Menu Header */}
          <div className="mb-16">
            <KumikoHeading
              level="h1"
              size="section"
              className="mb-3"
            >
              {menu.name}
            </KumikoHeading>
            {menu.description && (
              <KumikoText
                size="base"
                color="muted"
              >
                {menu.description}
              </KumikoText>
            )}
          </div>

          {/* Menu Categories */}
          <div className={cn(restaurantMenuSectionVariants({ layout }))}>
            {sortedCategories.map((category) => (
              <div key={category.id} className="space-y-6">
                {/* Category Header */}
                <div className="mb-8">
                  <KumikoHeading
                    level="h2"
                    size="step"
                    className="mb-2"
                    color="primary"
                  >
                    {category.name}
                  </KumikoHeading>
                  {category.description && (
                    <KumikoText
                      size="sm"
                      color="muted"
                      className="mb-6"
                    >
                      {category.description}
                    </KumikoText>
                  )}
                </div>

                {/* Menu Items */}
                <div className="space-y-0">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        menuItemVariants({
                          variant: itemVariant,
                          availability: item.isAvailable === false ? "unavailable" : "available"
                        })
                      )}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex justify-between items-baseline gap-8">
                        {/* Left: Item name and description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3">
                            <KumikoText
                              size="base"
                              className="font-normal"
                              color={item.isAvailable === false ? "muted" : "primary"}
                            >
                              {item.name}
                            </KumikoText>

                            {item.isAvailable === false && (
                              <KumikoText size="xs" color="subtle" className="uppercase tracking-wide">
                                Unavailable
                              </KumikoText>
                            )}
                          </div>

                          {item.description && (
                            <KumikoText
                              size="sm"
                              color="muted"
                              className="mt-1"
                            >
                              {item.description}
                            </KumikoText>
                          )}
                        </div>

                        {/* Right: Price and action */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {showPrices && (
                            <KumikoText
                              size="base"
                              className="font-normal tabular-nums"
                              color="primary"
                            >
                              ${item.price.toFixed(2)}
                            </KumikoText>
                          )}

                          {allowOrdering && item.isAvailable !== false && (
                            <KumikoButton
                              variant="minimal"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart(item)
                              }}
                            >
                              +
                            </KumikoButton>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty category */}
                  {category.items.length === 0 && (
                    <div className="text-center py-8">
                      <KumikoText
                        size="sm"
                        color="muted"
                      >
                        No items in this category yet
                      </KumikoText>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
)

RestaurantMenuSection.displayName = "RestaurantMenuSection"

export { RestaurantMenuSection, restaurantMenuSectionVariants }