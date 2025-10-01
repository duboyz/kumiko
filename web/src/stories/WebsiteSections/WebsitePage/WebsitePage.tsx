'use client'
import { LoadingState, ErrorState, EmptyState } from '@/components'
import { HeroSection } from '@/stories/organisms/HeroSection/HeroSection'
import { RestaurantMenuSection } from '@/stories/organisms/RestaurantMenuSection/RestaurantMenuSection'
import { TextSection } from '@/stories/organisms/TextSection/TextSection'
import type { WebsitePageDto, RestaurantMenuDto } from '@shared'
import { useMenuById } from '@shared'
import { FileX } from 'lucide-react'

interface WebsitePageProps {
  page: WebsitePageDto
  className?: string
  availableMenus?: RestaurantMenuDto[]
}

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
          <ErrorState title="Menu Not Found" message="The selected menu could not be loaded." variant="inline" />
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
        if (section.heroSection) {
          return <HeroSection />
        }

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

        if (section.restaurantMenuSection) {
          if (availableMenus.length === 0) {
            return (
              <MenuSectionWithFetch
                key={section.id}
                restaurantMenuId={section.restaurantMenuSection.restaurantMenuId}
                allowOrdering={section.restaurantMenuSection.allowOrdering}
              />
            )
          }

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

        return (
          <section key={section.id} className="py-20 px-10 bg-white">
            <div className="max-w-[1000px] mx-auto text-center">
              <p className="text-muted-foreground">Unknown section type</p>
            </div>
          </section>
        )
      })}

      {sortedSections.length === 0 && (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <EmptyState icon={FileX} title="No content yet" description="Add sections to start building your page" />
        </div>
      )}
    </div>
  )
}
