'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Globe, Settings, Eye, Power, PowerOff } from 'lucide-react'
import { useRestaurantWebsites, useCreateWebsite, useUpdateWebsite, useLocationSelection } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ContentContainer } from '@/components/ContentContainer'
import { openSubdomainUrl } from '@/lib/subdomain'

export default function WebsitesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    description: ''
  })

  const { selectedLocation } = useLocationSelection()
  const { data: websites, isLoading, error } = useRestaurantWebsites(
    selectedLocation?.id,
    selectedLocation?.type || 'Restaurant'
  )
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
        entityType: selectedLocation?.type || 'Restaurant'
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
        updates: { isPublished: !isCurrentlyPublished }
      })
    } catch (error) {
      console.error('Failed to toggle website publish status:', error)
    }
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </ContentContainer>
    )
  }

  if (error) {
    return (
      <ContentContainer>
        <ErrorMessage
          title="Failed to load websites"
          message="There was an error loading your websites. Please try again."
        />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Websites</h1>
          <p className="text-muted-foreground">
            Manage your restaurant websites and build pages with prebuilt sections.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
              <DialogDescription>
                Create a new website for your restaurant with a custom subdomain.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Website Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Restaurant Website"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center">
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                    placeholder="myrestaurant"
                    className="rounded-r-none"
                    required
                  />
                  <div className="bg-muted px-3 py-2 text-sm text-muted-foreground border border-l-0 rounded-r-md">
                    .kumiko.no
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A brief description of your website"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createWebsite.isPending}>
                  {createWebsite.isPending ? <LoadingSpinner size="sm" /> : 'Create Website'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites?.websites.map((website) => (
          <Card key={website.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {website.name}
              </CardTitle>
              <CardDescription>
                {website.subdomain}.kumiko.no
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {website.description && (
                  <p className="text-sm text-muted-foreground">{website.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{website.restaurantName}</span>
                  <span className={`px-2 py-1 rounded-full ${website.isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {website.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => openSubdomainUrl(website.subdomain)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.location.href = `/websites/${website.id}/pages`}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant={website.isPublished ? "destructive" : "default"}
                  className="w-full mt-2"
                  onClick={() => handleTogglePublish(website.id, website.isPublished)}
                  disabled={updateWebsite.isPending}
                >
                  {website.isPublished ? (
                    <>
                      <PowerOff className="h-4 w-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!websites?.websites || websites.websites.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create your first website to start building your online presence.
              </p>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Website
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </ContentContainer>
  )
}