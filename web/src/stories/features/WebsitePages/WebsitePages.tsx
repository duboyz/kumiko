import { WebsitePageDto, useCreatePage } from '@shared'
import { FileText } from 'lucide-react'
import { EmptyState } from '@/stories/shared/EmptyState/EmptyState'
import { WebsitePageCard } from '@/stories/shared/WebsitePageCard/WebsitePageCard'
import { CreateWebPageModal } from '@/stories/shared/CreateWebPageModal/CreateWebPageModal'
import { toast } from 'sonner'

interface WebsitePagesProps {
  websitePages: WebsitePageDto[]
  websiteId: string
  restaurantName?: string
}

export function WebsitePages({ websitePages, websiteId, restaurantName }: WebsitePagesProps) {
  const createPage = useCreatePage()

  const handlePageCreate = async (pageData: {
    slug: string
    title: string
    seoTitle: string
    seoDescription: string
    seoKeywords?: string
    templateId?: string
    sections?: any[]
  }) => {
    try {
      await createPage.mutateAsync({
        slug: pageData.slug,
        title: pageData.title,
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        seoKeywords: pageData.seoKeywords,
        websiteId,
        templateId: pageData.templateId,
        sections: pageData.sections,
      })

      toast.success(`Page "${pageData.title}" created successfully!`)
    } catch (error) {
      console.error('Failed to create page:', error)

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('slug already exists')) {
          toast.error('A page with this URL already exists. Please choose a different slug.')
        } else {
          toast.error(`Failed to create page: ${error.message}`)
        }
      } else {
        toast.error('Failed to create page. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Website Pages</h3>
          <p className="text-sm text-muted-foreground">
            {websitePages.length === 0
              ? 'No pages created yet'
              : `${websitePages.length} ${websitePages.length === 1 ? 'page' : 'pages'} created`}
          </p>
        </div>
        <CreateWebPageModal
          websiteId={websiteId}
          restaurantName={restaurantName}
          existingSlugs={websitePages.map(page => page.slug)}
          onPageCreate={handlePageCreate}
          isLoading={createPage.isPending}
        />
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
