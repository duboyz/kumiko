'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

// Import Kumiko website image from public folder
const KumikoWebsiteImage = '/icons/kumiko-website.png'
import { useRestaurantWebsites, useUpdateWebsite, useLocationSelection } from '@shared'
import { ContentContainer } from '@/components'
import { PageHeader } from '@/components'
import { Websites } from '@/stories/websites'
import { LoadingState } from '@/components'
import { ErrorState } from '@/components'
import { CreateWebsiteWizard } from '@/components/websites/CreateWebsiteWizard'

export default function WebsitesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { selectedLocation } = useLocationSelection()
  const {
    data: websites,
    isLoading,
    error,
  } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
  const updateWebsite = useUpdateWebsite()

  const handleTogglePublish = async (websiteId: string, isCurrentlyPublished: boolean) => {
    try {
      await updateWebsite.mutateAsync({
        websiteId,
        updates: { isPublished: !isCurrentlyPublished },
      })
    } catch (error) {
      console.error('Failed to toggle website publish status:', error)
    }
  }

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
          title="Failed to load websites"
          message="There was an error loading your websites. Please try again."
        />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={KumikoWebsiteImage} alt="Kumiko Website" width={60} height={60} className="rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold">Websites</h1>
            <p className="text-muted-foreground">
              Manage your restaurant websites and build pages with prebuilt sections.
            </p>
          </div>
        </div>

        <Button variant="default" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Website
        </Button>
      </div>

      <Websites />

      <CreateWebsiteWizard isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </ContentContainer>
  )
}
