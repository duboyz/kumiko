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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Website Pages</h3>
          <p className="text-sm text-muted-foreground">
            {websitePages.length === 0
              ? "No pages created yet"
              : `${websitePages.length} ${websitePages.length === 1 ? 'page' : 'pages'} created`
            }
          </p>
        </div>
        <CreateWebPageModal websiteId={websiteId} />
      </div>

      {websitePages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No pages yet"
          description="Start building your website by creating your first page."
          variant="compact"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websitePages.map(websitePage => (
            <WebsitePageCard key={websitePage.id} websitePage={websitePage} />
          ))}
        </div>
      )}
    </div>
  )
}

