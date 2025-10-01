import { WebsitePageDto } from '@shared'
import { FileText } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { WebsitePageCard } from '@/stories/components/WebsitePageCard/WebsitePageCard'
import { CreateWebPageModal } from '@/stories/components/CreateWebPageModal/CreateWebPageModal'

interface WebsitePagesProps {
  websitePages: WebsitePageDto[]
  websiteId: string
}
export function WebsitePages({ websitePages, websiteId }: WebsitePagesProps) {
  return (
    <div className="space-y-6">
      {websitePages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No pages yet"
          description="Start building your website by creating your first page."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websitePages.map(websitePage => (
            <WebsitePageCard key={websitePage.id} websitePage={websitePage} />
          ))}
        </div>
      )}
      <div className="flex justify-start">
        <CreateWebPageModal websiteId={websiteId} />
      </div>
    </div>
  )
}

