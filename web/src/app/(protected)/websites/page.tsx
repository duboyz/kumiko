'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
      <PageHeader
        title="Websites"
        description="Manage your restaurant websites and build pages with prebuilt sections."
        action={
          <Button variant="default" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Website
          </Button>
        }
      />

      <Websites />

      <CreateWebsiteWizard isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </ContentContainer>
  )
}
