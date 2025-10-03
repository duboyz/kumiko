'use client'

import { useParams } from 'next/navigation'
import { useWebsiteBySubdomain } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components'
import { WebsitePage } from '@/stories/websites'
import { PublicWebsiteHeader } from '@/components'

export default function PublicWebsitePage() {
  const params = useParams()
  const subdomain = params.subdomain as string

  const { data: websiteData, isLoading, error } = useWebsiteBySubdomain(subdomain)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Website not found'} />
  if (!websiteData) return <ErrorMessage message="Website not found" />

  // If the website is not published, show a message
  if (!websiteData.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Website Not Published</h1>
          <p className="text-gray-600">This website is not yet available to the public.</p>
        </div>
      </div>
    )
  }

  // Find the home page (first page or page with slug 'home')
  const homePage = websiteData.pages.find(p => p.slug === 'home') || websiteData.pages[0]

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">No Content Available</h1>
          <p className="text-gray-600">This website doesn't have any pages yet.</p>
        </div>
      </div>
    )
  }

  // Convert the public DTO structure to the format expected by WebsitePage component
  const adaptedPage = {
    id: homePage.id,
    title: homePage.title,
    slug: homePage.slug,
    seoTitle: homePage.title,
    seoDescription: websiteData.description,
    seoKeywords: '',
    subdomain: websiteData.subdomain,
    websiteId: websiteData.id,
    sections: homePage.sections.map(section => ({
      id: section.id,
      sortOrder: section.sortOrder,
      websitePageId: homePage.id,
      heroSection: section.heroSection
        ? {
            id: section.heroSection.id,
            title: section.heroSection.title,
            description: section.heroSection.description,
            imageUrl: section.heroSection.imageUrl,
            imageAlt: section.heroSection.imageAlt,
            backgroundColor: section.heroSection.backgroundColor,
            textColor: section.heroSection.textColor,
            backgroundOverlayColor: section.heroSection.backgroundOverlayColor,
            backgroundImageUrl: section.heroSection.backgroundImageUrl,
            buttonText: section.heroSection.buttonText,
            buttonUrl: section.heroSection.buttonUrl,
            buttonTextColor: section.heroSection.buttonTextColor,
            buttonBackgroundColor: section.heroSection.buttonBackgroundColor,
            type: section.heroSection.type as any, // Will be properly typed
          }
        : undefined,
      textSection: section.textSection
        ? {
            id: section.textSection.id,
            title: section.textSection.title,
            text: section.textSection.text,
            alignText: section.textSection.alignText as any, // Will be properly typed
            textColor: section.textSection.textColor,
          }
        : undefined,
      restaurantMenuSection: section.restaurantMenuSection
        ? {
            id: section.restaurantMenuSection.id,
            restaurantMenuId: section.restaurantMenuSection.restaurantMenuId,
            allowOrdering: section.restaurantMenuSection.allowOrdering,
          }
        : undefined,
    })),
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicWebsiteHeader
        websiteName={websiteData.name}
        pages={websiteData.pages.map(p => ({ id: p.id, title: p.title, slug: p.slug }))}
        currentPageSlug="home"
      />
      <WebsitePage
        page={adaptedPage}
        availableMenus={[]}
        restaurantId={websiteData.restaurantId}
        restaurantName={websiteData.restaurantName}
      />
    </div>
  )
}
