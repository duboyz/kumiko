import { useLocationSelection, usePages, useRestaurantWebsites, useUpdateWebsite } from '@shared'
import { useState, useEffect } from 'react'
import { WebsitePages } from '@/stories/websites/WebsitePages'
import { Globe, ExternalLink, Power, PowerOff } from 'lucide-react'
import { EmptyState } from '@/components'
import { SelectWebsite } from '@/stories/websites/SelectWebsite'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Websites() {
  const { selectedLocation } = useLocationSelection()
  const { data: websites } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('')
  const updateWebsite = useUpdateWebsite()

  const { data: websitePages } = usePages(selectedWebsiteId || '')

  const selectedWebsite = websites?.find(w => w.id === selectedWebsiteId)

  useEffect(() => {
    if (websites && websites.length === 1 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites[0].id)
    }
  }, [websites, selectedWebsiteId])

  const handleTogglePublish = async () => {
    if (!selectedWebsite) return

    try {
      await updateWebsite.mutateAsync({
        websiteId: selectedWebsite.id,
        updates: { isPublished: !selectedWebsite.isPublished },
      })
    } catch (error) {
      console.error('Failed to toggle publish status:', error)
    }
  }

  const getWebsiteUrl = (subdomain: string) => {
    return `https://${subdomain}.kumiko.no`
  }

  if (websites && websites.length === 0) {
    return (
      <EmptyState
        icon={Globe}
        title="No websites yet"
        description="Create your first website to start building your online presence."
        variant="compact"
      />
    )
  }

  return (
    <div className="space-y-8">
      {(websites?.length || 0) > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Website</CardTitle>
            <CardDescription>Choose which website you want to manage</CardDescription>
          </CardHeader>
          <CardContent>
            <SelectWebsite
              websites={websites || []}
              selectedWebsiteId={selectedWebsiteId}
              onSelectWebsite={setSelectedWebsiteId}
            />
          </CardContent>
        </Card>
      )}

      {selectedWebsite && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  {selectedWebsite.name}
                </CardTitle>
                <CardDescription>{selectedWebsite.description || 'No description provided'}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedWebsite.isPublished ? 'default' : 'secondary'}>
                  {selectedWebsite.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Website URL</p>
                  <p className="text-sm text-muted-foreground">{getWebsiteUrl(selectedWebsite.subdomain)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedWebsite.isPublished && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getWebsiteUrl(selectedWebsite.subdomain), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </Button>
                  )}
                  <Button
                    variant={selectedWebsite.isPublished ? 'secondary' : 'default'}
                    size="sm"
                    onClick={handleTogglePublish}
                    disabled={updateWebsite.isPending}
                  >
                    {selectedWebsite.isPublished ? (
                      <>
                        <PowerOff className="w-4 h-4 mr-2" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-2" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedWebsiteId && <WebsitePages websitePages={websitePages?.pages || []} websiteId={selectedWebsiteId} />}
    </div>
  )
}
