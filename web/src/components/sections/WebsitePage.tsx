'use client'

import { HeroSection } from './HeroSection'
import { TextSection } from './TextSection'
import { RestaurantMenuSection } from './RestaurantMenuSection'
import { PublicRestaurantMenuSection } from './PublicRestaurantMenuSection'
import type { WebsitePageDto, RestaurantMenuDto } from '@shared'

interface WebsitePageProps {
  page: WebsitePageDto
  className?: string
  availableMenus?: RestaurantMenuDto[]
}

export function WebsitePage({ page, className = '', availableMenus = [] }: WebsitePageProps) {
  const sortedSections = page.sections.sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className={`min-h-screen ${className}`}>
      {sortedSections.map((section) => {
        // Render Hero Sections
        if (section.heroSection) {
          return (
            <HeroSection
              key={section.id}
              title={section.heroSection.title}
              description={section.heroSection.description}
              imageUrl={section.heroSection.imageUrl}
              imageAlt={section.heroSection.imageAlt}
              backgroundColor={section.heroSection.backgroundColor}
              textColor={section.heroSection.textColor}
              backgroundOverlayColor={section.heroSection.backgroundOverlayColor}
              backgroundImageUrl={section.heroSection.backgroundImageUrl}
              buttonText={section.heroSection.buttonText}
              buttonUrl={section.heroSection.buttonUrl}
              buttonTextColor={section.heroSection.buttonTextColor}
              buttonBackgroundColor={section.heroSection.buttonBackgroundColor}
              type={section.heroSection.type}
            />
          )
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
          // If no availableMenus provided (public site), use the public component that fetches by ID
          if (availableMenus.length === 0) {
            return (
              <PublicRestaurantMenuSection
                key={section.id}
                restaurantMenuSectionId={section.restaurantMenuSection.id}
                restaurantMenuId={section.restaurantMenuSection.restaurantMenuId}
                allowOrdering={section.restaurantMenuSection.allowOrdering}
              />
            )
          }

          // For admin/editing mode with availableMenus, use the original component
          const menu = availableMenus.find(m => m.id === section.restaurantMenuSection!.restaurantMenuId);

          if (!menu) {
            return (
              <div key={section.id} className="py-12 px-4 text-center text-gray-500">
                <h3 className="text-lg font-semibold mb-2">Menu Not Found</h3>
                <p>The selected menu could not be loaded.</p>
              </div>
            );
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
          <div key={section.id} className="py-8 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-500">Unknown section type</p>
            </div>
          </div>
        )
      })}

      {/* Empty state when no sections */}
      {sortedSections.length === 0 && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-600">No content yet</h2>
            <p className="text-gray-500">Add sections to start building your page</p>
          </div>
        </div>
      )}
    </div>
  )
}