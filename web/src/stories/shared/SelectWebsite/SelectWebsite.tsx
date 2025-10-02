import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { WebsiteDto } from '@shared'
import { Globe } from 'lucide-react'

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
