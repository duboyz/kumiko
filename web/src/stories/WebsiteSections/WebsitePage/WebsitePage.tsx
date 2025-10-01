'use client'

import { HeroSection } from '../../organisms/HeroSection'
import { TextSection } from '../../organisms/TextSection/TextSection'
import { RestaurantMenuSection } from '../../organisms/RestaurantMenuSection/RestaurantMenuSection'
import { LoadingState, ErrorState, EmptyState } from '@/components'
import type { WebsitePageDto, RestaurantMenuDto } from '@shared'
import { useMenuById } from '@shared'
import { FileX } from 'lucide-react'

interface WebsitePageProps {
  page: WebsitePageDto
  className?: string
  availableMenus?: RestaurantMenuDto[]
}

// Component to handle menu fetching when not in editing mode
function MenuSectionWithFetch({
  restaurantMenuId,
  allowOrdering,
}: {
  restaurantMenuId: string
  allowOrdering: boolean
}) {
  const { data: menuData, isLoading, error } = useMenuById(restaurantMenuId)

  if (isLoading) {
    return (
      <section className="relative py-20 px-10 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <LoadingState variant="centered" />
        </div>
      </section>
    )
  }

  if (error || !menuData) {
    return (
      <section className="relative py-20 px-10 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <ErrorState
            title="Menu Not Found"
            message="The selected menu could not be loaded."
            variant="inline"
          />
        </div>
      </section>
    )
  }

  return <RestaurantMenuSection restaurantMenu={menuData} allowOrdering={allowOrdering} isEditing={false} />
}

export function WebsitePage({ page, className = '', availableMenus = [] }: WebsitePageProps) {
  const sortedSections = page.sections.sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className={`min-h-screen ${className}`}>
      {sortedSections.map(section => {
        // Render Hero Sections
        if (section.heroSection) {
          return <HeroSection key={section.id} section={section.heroSection} />
        }

        // Render Text Sections
        if (section.textSection) {
          return (
            <TextSection
              key={section.id}
              title={section.textSection.title}
              text={section.textSection.text}
              alignText={section.textSection.alignText}
              textColor={section.textSection.textColor}
            />
          )
        }

        // Render Restaurant Menu Sections
        if (section.restaurantMenuSection) {
          // If no availableMenus provided (public site), fetch the menu data
          if (availableMenus.length === 0) {
            return (
              <MenuSectionWithFetch
                key={section.id}
                restaurantMenuId={section.restaurantMenuSection.restaurantMenuId}
                allowOrdering={section.restaurantMenuSection.allowOrdering}
              />
            )
          }

          // For admin/editing mode with availableMenus, use the menu from props
          const menu = availableMenus.find(m => m.id === section.restaurantMenuSection!.restaurantMenuId)

          if (!menu) {
            return (
              <section key={section.id} className="relative py-20 px-10 bg-white">
                <div className="max-w-[1000px] mx-auto">
                  <ErrorState
                    title="Menu Not Found"
                    message="The selected menu could not be loaded."
                    variant="inline"
                  />
                </div>
              </section>
            )
          }

          return (
            <RestaurantMenuSection
              key={section.id}
              restaurantMenu={menu}
              allowOrdering={section.restaurantMenuSection.allowOrdering}
              isEditing={false}
            />
          )
        }

        // Fallback for unknown sections
        return (
          <section key={section.id} className="py-20 px-10 bg-white">
            <div className="max-w-[1000px] mx-auto text-center">
              <p className="text-muted-foreground">Unknown section type</p>
            </div>
          </section>
        )
      })}

      {/* Empty state when no sections */}
      {sortedSections.length === 0 && (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <EmptyState
            icon={FileX}
            title="No content yet"
            description="Add sections to start building your page"
          />
        </div>
      )}
    </div>
  )
}
