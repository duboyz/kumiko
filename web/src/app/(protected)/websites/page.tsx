'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useRestaurantWebsites, useCreateWebsite, useUpdateWebsite, useLocationSelection } from '@shared'
import { LoadingSpinner } from '@/components'
import { ContentContainer } from '@/components'
import { PageHeader } from '@/components'
import { Websites } from '@/stories/websites'
import { LoadingState } from '@/components'
import { ErrorState } from '@/components'
import { FormField } from '@/components'

export default function WebsitesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    description: '',
  })

  const { selectedLocation } = useLocationSelection()
  const {
    data: websites,
    isLoading,
    error,
  } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
  const createWebsite = useCreateWebsite()
  const updateWebsite = useUpdateWebsite()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createWebsite.mutateAsync({
        name: formData.name,
        subdomain: formData.subdomain,
        description: formData.description || undefined,
        entityId: selectedLocation?.id,
        entityType: selectedLocation?.type || 'Restaurant',
      })

      setIsCreateOpen(false)
      setFormData({ name: '', subdomain: '', description: '' })
    } catch (error) {
      console.error('Failed to create website:', error)
    }
  }

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
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Create Website
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Website</DialogTitle>
                <DialogDescription>Create a new website for your restaurant with a custom subdomain.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <FormField label="Website Name" htmlFor="name" required>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Restaurant Website"
                    required
                  />
                </FormField>

                <FormField label="Subdomain" htmlFor="subdomain" required>
                  <div className="flex items-stretch">
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData(prev => ({ ...prev, subdomain: e.target.value }))
                      }
                      placeholder="myrestaurant"
                      className="flex-1 rounded-r-none"
                      required
                    />
                    <div className="bg-muted px-4 flex items-center text-sm text-muted-foreground border border-l-0 rounded-r-md">
                      .kumiko.no
                    </div>
                  </div>
                </FormField>

                <FormField label="Description (optional)" htmlFor="description">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief description of your website"
                  />
                </FormField>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" disabled={createWebsite.isPending}>
                    {createWebsite.isPending ? 'Creating...' : 'Create Website'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Websites />
    </ContentContainer>
  )
}
