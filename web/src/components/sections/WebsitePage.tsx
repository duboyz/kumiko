'use client'

import { HeroSection } from './HeroSection'
import { TextSection } from './TextSection'
import type { WebsitePageDto } from '@shared'

interface WebsitePageProps {
  page: WebsitePageDto
  className?: string
}

export function WebsitePage({ page, className = '' }: WebsitePageProps) {
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
          return (
            <div key={section.id} className="py-12 px-4 md:py-20 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Menu</h2>
                <p className="text-gray-600 mb-8">Menu section coming soon...</p>
                <div className="bg-gray-100 rounded-lg p-8">
                  <p className="text-sm text-gray-500">
                    Restaurant Menu Section (ID: {section.restaurantMenuSection.restaurantMenuId})
                  </p>
                  <p className="text-sm text-gray-500">
                    Ordering: {section.restaurantMenuSection.allowOrdering ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
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