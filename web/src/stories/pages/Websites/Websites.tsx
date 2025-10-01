import { ContentContainer } from '@/components/ContentContainer'
import { Select, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@/components/ui/select'
import { SelectContent } from '@/components/ui/select'

import { useLocationSelection, usePages, useRestaurantWebsites, WebsiteDto, WebsitePageDto } from '@shared'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Websites() {
  const { selectedLocation } = useLocationSelection()
  const {
    data: websites,
    isLoading,
    error,
  } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('')

  const {
    data: websitePages,
    isLoading: isLoadingWebsitePages,
    error: errorWebsitePages,
  } = usePages(selectedWebsiteId || '')

  useEffect(() => {
    if (websites?.websites?.length === 1 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites.websites[0].id)
    }
  }, [websites?.websites, selectedWebsiteId])

  return (
    <ContentContainer>
      <SelectWebsite
        websites={websites?.websites || []}
        selectedWebsiteId={selectedWebsiteId}
        onSelectWebsite={setSelectedWebsiteId}
      />

      {selectedWebsiteId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websitePages?.pages.map(page => (
            <WebsitePages key={page.id} websitePage={page} />
          ))}
        </div>
      )}
    </ContentContainer>
  )
}

const WebsitePages = ({ websitePage }: { websitePage: WebsitePageDto }) => {
  return (
    <div className="border-1 border-gray-200 rounded-md p-4 flex flex-col gap-2">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-2xl font-bold">{websitePage.title}</h1>
        <p>/{websitePage.slug}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Delete</Button>
        <Link href={`/websites/${websitePage.websiteId}/pages/${websitePage.id}`}>Edit</Link>
      </div>
    </div>
  )
}

interface SelectWebsiteProps {
  websites: WebsiteDto[]
  selectedWebsiteId: string
  onSelectWebsite: (websiteId: string) => void
}
export const SelectWebsite = ({ websites, selectedWebsiteId, onSelectWebsite }: SelectWebsiteProps) => {
  // Don't show selector if there's only one website
  if (websites.length <= 1) {
    return null
  }

  return (
    <Select onValueChange={onSelectWebsite} value={selectedWebsiteId}>
      <SelectTrigger>
        <SelectValue placeholder="Select a website" />
      </SelectTrigger>
      <SelectContent>
        {websites.map(website => (
          <SelectItem key={website.id} value={website.id}>
            {website.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
