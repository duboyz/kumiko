import { GetMenuByIdResult, Currency } from '@shared'
import { MenuItemCard } from '../MenuItemCard'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface MenuDisplayProps {
  menu: GetMenuByIdResult
  currency?: Currency
  onAddToCart: (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string,
    additionalOptionId?: string,
    additionalOptionName?: string,
    additionalOptionPrice?: number
  ) => void
  className?: string
}

export function MenuDisplay({ menu, currency = Currency.USD, onAddToCart, className = '' }: MenuDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Animate category sections
      gsap.fromTo(
        '.category-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.category-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Animate menu items
      gsap.fromTo(
        '.menu-item-card',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.menu-item-card',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [menu])

  return (
    <div
      ref={containerRef}
      className={`py-4 sm:py-6 lg:py-8 px-4${className}`}
    >
      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {menu.categories.map((category, categoryIndex) => (
          <div key={category.id} className="category-section">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-foreground px-1">{category.name}</h3>
              {category.description && (
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl px-1">
                  {category.description}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:gap-4">
              {category.menuCategoryItems
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((categoryItem, itemIndex) => {
                  const item = categoryItem.menuItem
                  if (!item) return null

                  return (
                    <div
                      key={categoryItem.id}
                      className="menu-item-card"
                      style={{
                        animationDelay: `${itemIndex * 0.1}s`,
                      }}
                    >
                      <MenuItemCard item={item} currency={currency} onAddToCart={onAddToCart} />
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
