'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { usePages, useLocationSelection } from '@shared'
import { ContentContainer } from '@/stories/shared/ContentContainer/ContentContainer'
import { LoadingState } from '@/stories/shared/LoadingState/LoadingState'
import { ErrorState } from '@/stories/shared/ErrorState/ErrorState'
import { WebsitePages } from '@/stories/features/WebsitePages/WebsitePages'

export default function WebsitePagesPage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.websiteId as string

  const { data: pagesData, isLoading, error } = usePages(websiteId)
  const { selectedLocation } = useLocationSelection()

  if (isLoading) {
    return (
      <ContentContainer>
        <LoadingState />
      </ContentContainer>
    )
  }

  if (error) {
    return (
      <ContentContainer>
        <ErrorState
          title="Failed to load pages"
          message="There was an error loading your website pages. Please try again."
        />
      </ContentContainer>
    )
  }

  const pages = pagesData?.pages || []
  const restaurantName = selectedLocation?.name || 'Your Restaurant'

  return (
    <ContentContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/websites')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Websites
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Website Pages</h1>
          <p className="text-muted-foreground">
            Create and manage pages for your website. Build pages using prebuilt sections or templates.
          </p>
        </div>

        <WebsitePages
          websitePages={pages}
          websiteId={websiteId}
          restaurantName={restaurantName}
        />
      </div>
    </ContentContainer>
  )
}
