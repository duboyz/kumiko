import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { useLocationSelection, usePages, useRestaurantWebsites, WebsiteDto } from '@shared'
import { useState, useEffect } from 'react'
import { WebsitePages } from '@/stories/organisms/WebsitePages'
import { Globe } from 'lucide-react'
import { FormField } from '@/components/FormField'

export function Websites() {
  const { selectedLocation } = useLocationSelection()
  const { data: websites } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('')

  const { data: websitePages } = usePages(selectedWebsiteId || '')

  useEffect(() => {
    if (websites?.length === 1 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites[0].id)
    }
  }, [websites, selectedWebsiteId])

  if (websites && websites.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {(websites?.length || 0) > 1 && (
        <div className="bg-white border p-6">
          <FormField label="Select Website" htmlFor="selectWebsite">
            <SelectWebsite
              websites={websites || []}
              selectedWebsiteId={selectedWebsiteId}
              onSelectWebsite={setSelectedWebsiteId}
            />
          </FormField>
        </div>
      )}

      {selectedWebsiteId && <WebsitePages websitePages={websitePages?.pages || []} websiteId={selectedWebsiteId} />}
    </div>
  )
}

interface SelectWebsiteProps {
  websites: WebsiteDto[]
  selectedWebsiteId: string
  onSelectWebsite: (websiteId: string) => void
}
export const SelectWebsite = ({ websites, selectedWebsiteId, onSelectWebsite }: SelectWebsiteProps) => {
  return (
    <Select onValueChange={onSelectWebsite} value={selectedWebsiteId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a website" />
      </SelectTrigger>
      <SelectContent>
        {websites.map(website => (
          <SelectItem key={website.id} value={website.id}>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {website.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
